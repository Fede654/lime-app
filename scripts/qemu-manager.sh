#!/usr/bin/env bash
#
# Standardized QEMU LibreMesh Management Script
# Handles QEMU lifecycle with proper cleanup and restart
#
# Usage: ./scripts/qemu-manager.sh {start|stop|restart|status|deploy}
#

set -e

# Configuration
LIME_PACKAGES_DIR="../lime-packages"
LIME_APP_FILES_DIR="$LIME_PACKAGES_DIR/packages/lime-app/files/www/app"
ROOTFS_PATH="$LIME_PACKAGES_DIR/build/libremesh-2024.1-ow23.05.5-default-x86-64-generic-squashfs-rootfs.img.gz"
KERNEL_PATH="$LIME_PACKAGES_DIR/build/libremesh-2024.1-ow23.05.5-default-x86-64-generic-initramfs-kernel.bin"

# Try to detect available rootfs/kernel images if default paths don't exist
if [ ! -f "$ROOTFS_PATH" ]; then
    # Try 2020.4 version as fallback
    ROOTFS_PATH="$LIME_PACKAGES_DIR/build/libremesh-2020.4-ow19-x86-64-rootfs.tar.gz"
    KERNEL_PATH="$LIME_PACKAGES_DIR/build/libremesh-2020.4-ow19-x86-64-ramfs.bzImage"
fi

QEMU_IP="10.13.0.1"
TELNET_PORT="45400"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if QEMU is running by testing connectivity
check_qemu_running() {
    # Check if we can reach the QEMU instance
    if ping -c 1 -W 1 "$QEMU_IP" >/dev/null 2>&1; then
        return 0  # Running
    else
        return 1  # Not running
    fi
}

# Find and kill QEMU processes
kill_qemu_processes() {
    print_status "Stopping existing QEMU processes..."
    
    # Find QEMU processes by command pattern
    QEMU_PIDS=$(pgrep -f "qemu.*libremesh" || true)
    
    if [ -z "$QEMU_PIDS" ]; then
        print_status "No QEMU processes found"
        return
    fi
    
    for pid in $QEMU_PIDS; do
        print_status "Stopping QEMU process $pid"
        sudo kill -TERM "$pid" 2>/dev/null || true
    done
    
    # Wait a moment for graceful shutdown
    sleep 2
    
    # Force kill if still running
    QEMU_PIDS=$(pgrep -f "qemu.*libremesh" || true)
    if [ -n "$QEMU_PIDS" ]; then
        for pid in $QEMU_PIDS; do
            print_warning "Force killing QEMU process $pid"
            sudo kill -KILL "$pid" 2>/dev/null || true
        done
    fi
    
    # Clean up network interfaces that might be left behind
    sudo ip link delete br-lan 2>/dev/null || true
    sudo ip link delete tap0 2>/dev/null || true
    
    print_status "QEMU processes stopped"
}

# Check prerequisites
check_prerequisites() {
    if [ ! -d "$LIME_PACKAGES_DIR" ]; then
        print_error "lime-packages directory not found at $LIME_PACKAGES_DIR"
        exit 1
    fi
    
    if [ ! -f "$ROOTFS_PATH" ]; then
        print_error "LibreMesh rootfs not found at $ROOTFS_PATH"
        print_error "Available images:"
        ls -la "$LIME_PACKAGES_DIR/build/" | grep -E "\.(img\.gz|tar\.gz)$" || echo "No images found"
        exit 1
    fi
    
    if [ ! -f "$KERNEL_PATH" ]; then
        print_error "LibreMesh kernel not found at $KERNEL_PATH"
        print_error "Available kernels:"
        ls -la "$LIME_PACKAGES_DIR/build/" | grep -E "\.(bin|bzImage)$" || echo "No kernels found"
        exit 1
    fi
}

# Start QEMU
start_qemu() {
    print_status "Starting QEMU LibreMesh..."
    
    check_prerequisites
    
    if check_qemu_running; then
        print_warning "QEMU already running at $QEMU_IP"
        return 0
    fi
    
    cd "$LIME_PACKAGES_DIR"
    
    # Start QEMU in background
    nohup sudo ./tools/qemu_dev_start \
        --libremesh-workdir . \
        "$ROOTFS_PATH" \
        "$KERNEL_PATH" > /tmp/qemu-libremesh.log 2>&1 &
    
    print_status "QEMU starting... (logs in /tmp/qemu-libremesh.log)"
    
    # Wait for QEMU to be ready
    print_status "Waiting for QEMU to be ready..."
    for i in {1..30}; do
        if check_qemu_running; then
            print_status "✓ QEMU LibreMesh ready at http://$QEMU_IP"
            print_status "✓ lime-app available at http://$QEMU_IP/app"
            return 0
        fi
        sleep 2
        echo -n "."
    done
    
    echo
    print_error "QEMU failed to start or become ready"
    print_error "Check logs: cat /tmp/qemu-libremesh.log"
    return 1
}

# Stop QEMU
stop_qemu() {
    print_status "Stopping QEMU LibreMesh..."
    kill_qemu_processes
}

# Restart QEMU
restart_qemu() {
    print_status "Restarting QEMU LibreMesh..."
    stop_qemu
    sleep 2
    start_qemu
}

# Show QEMU status
show_status() {
    print_status "QEMU LibreMesh Status:"
    
    if check_qemu_running; then
        print_status "✓ QEMU is running at $QEMU_IP"
        
        # Test ubus connectivity
        if curl -s --max-time 3 "http://$QEMU_IP/ubus" >/dev/null 2>&1; then
            print_status "✓ ubus service accessible"
        else
            print_warning "✗ ubus service not accessible"
        fi
        
        # Test lime-app
        if curl -s --max-time 3 "http://$QEMU_IP/app/" | grep -q "lime-app\|html\|Index"; then
            print_status "✓ lime-app accessible at http://$QEMU_IP/app/"
        else
            print_warning "✗ lime-app not found at http://$QEMU_IP/app/"
            print_warning "  Run: npm run deploy:qemu to deploy lime-app"
        fi
    else
        print_warning "✗ QEMU is not running"
        print_status "  Run: npm run qemu:start to start QEMU"
    fi
}

# Deploy lime-app to running QEMU
deploy_to_qemu() {
    print_status "Deploying lime-app to running QEMU..."
    
    if ! check_qemu_running; then
        print_error "QEMU is not running. Start it first with: npm run qemu:start"
        exit 1
    fi
    
    # Build lime-app first
    print_status "Building lime-app..."
    npm run build:production
    
    # Deploy to lime-packages
    print_status "Deploying to lime-packages..."
    mkdir -p "$LIME_APP_FILES_DIR"
    cp -r build/* "$LIME_APP_FILES_DIR/"
    
    # Copy directly to running QEMU (if possible)
    print_status "Copying to running QEMU instance..."
    if scp -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o ConnectTimeout=5 \
        -r build/* root@"$QEMU_IP":/www/app/ 2>/dev/null; then
        print_status "✓ lime-app deployed successfully"
        print_status "✓ Available at http://$QEMU_IP/app/"
    else
        print_warning "Direct copy failed, restarting QEMU to pick up changes..."
        restart_qemu
    fi
}

# Main script logic
case "${1:-help}" in
    start)
        start_qemu
        ;;
    stop)
        stop_qemu
        ;;
    restart)
        restart_qemu
        ;;
    status)
        show_status
        ;;
    deploy)
        deploy_to_qemu
        ;;
    help|--help|-h)
        echo "Usage: $0 {start|stop|restart|status|deploy}"
        echo ""
        echo "Commands:"
        echo "  start    - Start QEMU LibreMesh"
        echo "  stop     - Stop QEMU LibreMesh"
        echo "  restart  - Restart QEMU LibreMesh"
        echo "  status   - Show QEMU and lime-app status"
        echo "  deploy   - Build and deploy lime-app to running QEMU"
        echo "  help     - Show this help message"
        echo ""
        echo "Examples:"
        echo "  $0 start     # Start QEMU"
        echo "  $0 deploy    # Deploy lime-app to running QEMU"
        echo "  $0 status    # Check status"
        echo "  $0 restart   # Restart QEMU"
        ;;
    *)
        print_error "Unknown command: $1"
        print_error "Use '$0 help' for usage information"
        exit 1
        ;;
esac