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
ROOTFS_PATH="$LIME_PACKAGES_DIR/build/librerouteros-24.10.1-r28597-0425664679-x86-64-rootfs.tar.gz"
KERNEL_PATH="$LIME_PACKAGES_DIR/build/librerouteros-24.10.1-r28597-0425664679-x86-64-generic-kernel.bin"

# Try to detect available rootfs/kernel images if default paths don't exist
if [ ! -f "$ROOTFS_PATH" ]; then
    # Try 2020.4 version as fallback (only tar.gz format works with qemu_dev_start)
    ROOTFS_PATH="$LIME_PACKAGES_DIR/build/libremesh-2024.1-ow23.05.5-default-x86-64-generic-squashfs-rootfs.img.gz"
    KERNEL_PATH="$LIME_PACKAGES_DIR/build/libremesh-2024.1-ow23.05.5-default-x86-64-generic-initramfs-kernel.bin"
fi

# Note: Image validation is done in check_prerequisites function

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

# Check if QEMU is running by testing connectivity and process
check_qemu_running() {
    # First check if QEMU process is running
    if ! pgrep -f "qemu-system-x86_64" >/dev/null 2>&1; then
        return 1  # No process running
    fi
    
    # Then check if we can reach the QEMU instance
    if ping -c 1 -W 1 "$QEMU_IP" >/dev/null 2>&1; then
        return 0  # Running and accessible
    else
        return 1  # Process running but not accessible
    fi
}

# Auto-configure LibreMesh network after boot
setup_libremesh_network() {
    print_status "Waiting for LibreMesh boot to complete..."
    
    # Wait for LibreMesh to fully boot (look for specific boot messages)
    for i in {1..15}; do
        # Check if we can see the root prompt or system is ready
        sudo screen -S libremesh -X hardcopy /tmp/boot_check.txt 2>/dev/null
        if grep -q "root@.*:/#" /tmp/boot_check.txt 2>/dev/null; then
            print_status "✓ LibreMesh boot completed"
            break
        fi
        
        # Send Enter periodically to activate console
        if [ $((i % 3)) -eq 0 ]; then
            sudo screen -S libremesh -X stuff $'\n' 2>/dev/null || true
        fi
        
        sleep 2
        echo -n "."
    done
    echo
    
    print_status "Configuring network interfaces..."
    
    # Detect available network interface
    print_status "Detecting network interfaces..."
    sudo screen -S libremesh -X stuff 'ip link show | grep -E "^[0-9]+: (eth|br-|wlan)" | head -1'$'\n'
    sleep 2
    
    # Try common interface names in order of preference
    print_status "Configuring network with fallback interface detection..."
    
    # First try br-lan (mesh bridge)
    sudo screen -S libremesh -X stuff 'if ip link show br-lan >/dev/null 2>&1; then echo "Using br-lan"; ip addr add 10.13.0.1/16 dev br-lan; ip link set br-lan up; fi'$'\n'
    sleep 2
    
    # Fallback to eth0 if br-lan doesn't exist
    sudo screen -S libremesh -X stuff 'if ! ip addr show br-lan | grep -q "10.13.0.1" 2>/dev/null; then echo "Fallback to eth0"; ip addr add 10.13.0.1/16 dev eth0 2>/dev/null; ip link set eth0 up 2>/dev/null; fi'$'\n'
    sleep 2
    
    # Final fallback to first available ethernet interface
    sudo screen -S libremesh -X stuff 'if ! ip addr show | grep -q "10.13.0.1" 2>/dev/null; then ETH_IF=$(ip link show | grep -o "^[0-9]*: eth[0-9]*" | head -1 | cut -d: -f2 | tr -d " "); if [ -n "$ETH_IF" ]; then echo "Using $ETH_IF"; ip addr add 10.13.0.1/16 dev $ETH_IF; ip link set $ETH_IF up; fi; fi'$'\n'
    sleep 2
    
    # Set default root password for development
    print_status "Setting default root password to 'admin'..."
    sudo screen -S libremesh -X stuff 'echo -e "admin\\nadmin" | passwd root'$'\n'
    sleep 2
    
    # Start uHTTPd if not running
    sudo screen -S libremesh -X stuff '/etc/init.d/uhttpd start'$'\n'
    sleep 2
    
    # Ensure ubus is running for API access
    sudo screen -S libremesh -X stuff '/etc/init.d/ubus start'$'\n'
    sleep 2
    
    # Verify network configuration
    print_status "Verifying network configuration..."
    sudo screen -S libremesh -X stuff 'echo "=== Network Status ==="; ip addr show | grep -A1 "10.13.0.1"; echo "=== uHTTPd Status ==="; ps | grep uhttpd || echo "uHTTPd not running"; echo "=== Default Credentials ==="; echo "Username: root, Password: admin"'$'\n'
    sleep 2
    
    print_status "Network and authentication configuration completed"
    sudo rm -f /tmp/boot_check.txt 2>/dev/null || true
}

# Find and kill QEMU processes
kill_qemu_processes() {
    print_status "Stopping existing QEMU processes..."
    
    # Kill screen session first if it exists
    if sudo screen -list | grep -q "libremesh"; then
        print_status "Stopping screen session 'libremesh'"
        sudo screen -S libremesh -X quit 2>/dev/null || true
        sleep 2
    fi
    
    # Find and kill any remaining QEMU processes
    QEMU_PIDS=$(pgrep -f "qemu-system-x86_64" || true)
    
    if [ -z "$QEMU_PIDS" ]; then
        print_status "No QEMU processes found"
    else
        for pid in $QEMU_PIDS; do
            print_status "Stopping QEMU process $pid"
            sudo kill -TERM "$pid" 2>/dev/null || true
        done
        
        # Wait a moment for graceful shutdown
        sleep 3
        
        # Force kill if still running
        QEMU_PIDS=$(pgrep -f "qemu-system-x86_64" || true)
        if [ -n "$QEMU_PIDS" ]; then
            for pid in $QEMU_PIDS; do
                print_warning "Force killing QEMU process $pid"
                sudo kill -KILL "$pid" 2>/dev/null || true
            done
        fi
    fi
    
    # Clean up LibreMesh-specific network interfaces
    print_status "Cleaning up network interfaces..."
    
    # Clean up lime bridge and TAP interfaces for node 00 (default)
    for ifc in lime_br0 lime_tap00_0 lime_tap00_1 lime_tap00_2; do
        if ip link show "$ifc" >/dev/null 2>&1; then
            print_status "Removing interface $ifc"
            sudo ip link delete "$ifc" 2>/dev/null || true
        fi
    done
    
    # Clean up any remaining lime_tap* interfaces
    for ifc in $(ip link show | grep -o 'lime_tap[^:]*' || true); do
        if [ -n "$ifc" ]; then
            print_status "Removing remaining interface $ifc"
            sudo ip link delete "$ifc" 2>/dev/null || true
        fi
    done
    
    # Clean up temporary files (with sudo if needed)
    sudo rm -f /tmp/lime_rootfs_*.cpio /tmp/qemu-libremesh.log 2>/dev/null || true
    
    print_status "QEMU processes and network cleanup completed"
}

# Check prerequisites
check_prerequisites() {
    if [ ! -d "$LIME_PACKAGES_DIR" ]; then
        print_error "lime-packages directory not found at $LIME_PACKAGES_DIR"
        exit 1
    fi
    
    # Validate that we have a compatible rootfs (must be tar.gz, not squashfs img.gz)
    if [[ "$ROOTFS_PATH" == *.img.gz ]]; then
        print_error "Detected squashfs image format: $(basename "$ROOTFS_PATH")"
        print_error "QEMU development requires tar.gz format rootfs, not squashfs img.gz"
        print_error "Please use LibreMesh 2020.4 images or convert the image format"
        # Try fallback to 2020.4 if it exists
        FALLBACK_ROOTFS="$LIME_PACKAGES_DIR/build/libremesh-2020.4-ow19-x86-64-rootfs.tar.gz"
        FALLBACK_KERNEL="$LIME_PACKAGES_DIR/build/libremesh-2020.4-ow19-x86-64-ramfs.bzImage"
        if [ -f "$FALLBACK_ROOTFS" ] && [ -f "$FALLBACK_KERNEL" ]; then
            print_status "Falling back to LibreMesh 2020.4 compatible images"
            ROOTFS_PATH="$FALLBACK_ROOTFS"
            KERNEL_PATH="$FALLBACK_KERNEL"
        else
            print_error "No compatible tar.gz rootfs images found"
            exit 1
        fi
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
    
    # Test if rootfs can be extracted with tar
    if ! tar -tf "$ROOTFS_PATH" >/dev/null 2>&1; then
        print_error "Rootfs file $ROOTFS_PATH is not a valid tar archive"
        print_error "QEMU development requires extractable tar.gz format"
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
    
    # Start QEMU in a screen session for proper console interaction
    print_status "Starting QEMU in screen session 'libremesh'..."
    sudo screen -dmS libremesh ./tools/qemu_dev_start \
        --libremesh-workdir . \
        "$ROOTFS_PATH" \
        "$KERNEL_PATH"
    
    print_status "QEMU starting in screen session..."
    print_status "Use 'sudo screen -r libremesh' to access console"
    
    # Wait for QEMU to be ready and auto-configure network
    print_status "Waiting for QEMU to boot..."
    for i in {1..8}; do
        if pgrep -f "qemu-system-x86_64" >/dev/null 2>&1; then
            break
        fi
        sleep 2
        echo -n "."
    done
    
    if ! pgrep -f "qemu-system-x86_64" >/dev/null 2>&1; then
        echo
        print_error "QEMU process failed to start"
        return 1
    fi
    
    # Auto-configure LibreMesh network
    print_status "Auto-configuring LibreMesh network..."
    setup_libremesh_network
    
    # Verify it's working
    if check_qemu_running; then
        print_status "✓ QEMU LibreMesh ready at http://$QEMU_IP"
        print_status "✓ lime-app available at http://$QEMU_IP/app"
        print_status "✓ Default credentials: root/admin"
        print_status "✓ Console accessible via: sudo screen -r libremesh"
        return 0
    else
        print_warning "LibreMesh started but network not fully ready"
        print_status "✓ Default credentials: root/admin"
        print_status "✓ Console accessible via: sudo screen -r libremesh"
        return 0
    fi
    
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
        print_status "✓ Default credentials: root/admin"
        
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
        
        # Test authentication with default credentials
        auth_test=$(curl -s --max-time 3 "http://$QEMU_IP/ubus" \
            -H "Content-Type: application/json" \
            -d '{"jsonrpc":"2.0","id":1,"method":"call","params":["00000000000000000000000000000000","session","login",{"username":"root","password":"admin"}]}' \
            2>/dev/null || echo '{"error":"failed"}')
        
        if echo "$auth_test" | grep -q '"result":\s*\[0'; then
            print_status "✓ Authentication working with default credentials"
        else
            print_warning "✗ Authentication may need configuration"
        fi
    else
        print_warning "✗ QEMU is not running"
        print_status "  Run: npm run qemu:start to start QEMU"
    fi
}

# Deploy lime-app using official LibreMesh method
deploy_to_qemu() {
    print_status "Deploying lime-app using official LibreMesh method..."
    
    # Build lime-app first
    print_status "Building lime-app..."
    npm run build:production
    
    # Deploy to lime-packages (official LibreMesh method)
    print_status "Deploying to lime-packages structure..."
    mkdir -p "$LIME_APP_FILES_DIR"
    
    # Clean old build files to prevent accumulation
    print_status "Cleaning old build files..."
    rm -rf "$LIME_APP_FILES_DIR"/*
    
    cp -r build/* "$LIME_APP_FILES_DIR/"
    print_status "✓ Files copied to lime-packages/packages/lime-app/files/www/app/"
    
    # Check if QEMU is running to determine deployment strategy
    if check_qemu_running; then
        print_status "QEMU is running - attempting live deployment..."
        
        # Try direct SCP as quick method (fallback approach)
        if scp -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o ConnectTimeout=5 \
            -r build/* root@"$QEMU_IP":/www/app/ 2>/dev/null; then
            print_status "✓ Live deployment successful"
            print_status "✓ lime-app available at http://$QEMU_IP/app/"
        else
            print_warning "Live deployment failed, restarting QEMU to pick up changes..."
            print_status "This will ensure lime-packages overlay is properly applied..."
            restart_qemu
        fi
    else
        print_status "QEMU is not running"
        print_status "Files deployed to lime-packages structure"
        print_status "Start QEMU with: npm run qemu:start"
        print_status "The lime-app will be available via workdir overlay"
    fi
    
    print_status "✓ Deployment completed using official LibreMesh method"
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
        echo "  deploy   - Build and deploy lime-app using official LibreMesh method"
        echo "  help     - Show this help message"
        echo ""
        echo "Examples:"
        echo "  $0 start     # Start QEMU"
        echo "  $0 deploy    # Deploy lime-app using official LibreMesh method"
        echo "  $0 status    # Check status"
        echo "  $0 restart   # Restart QEMU"
        ;;
    *)
        print_error "Unknown command: $1"
        print_error "Use '$0 help' for usage information"
        exit 1
        ;;
esac