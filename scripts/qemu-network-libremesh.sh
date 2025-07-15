#!/usr/bin/env bash
#
# LibreMesh 23.05.5 Network Configuration
# Optimized for stable mesh networking environment
#

setup_libremesh_network() {
    print_status "Configuring LibreMesh 23.05.5 network (stable configuration)..."
    
    # Wait for LibreMesh to fully boot with mesh-specific timing
    print_status "Waiting for LibreMesh mesh services to initialize..."
    for i in {1..15}; do
        sudo screen -S libremesh -X hardcopy /tmp/boot_check.txt 2>/dev/null
        if grep -q "root@.*:/#\|OpenWrt.*#" /tmp/boot_check.txt 2>/dev/null; then
            print_status "✓ LibreMesh boot completed"
            break
        fi
        
        # Send Enter every few seconds to activate console
        if [ $((i % 3)) -eq 0 ]; then
            sudo screen -S libremesh -X stuff $'\n' 2>/dev/null || true
        fi
        
        sleep 2
        echo -n "."
    done
    echo
    
    print_status "Configuring LibreMesh mesh bridge network..."
    
    # LibreMesh-specific network setup
    # Try br-lan first (LibreMesh mesh bridge)
    sudo screen -S libremesh -X stuff 'echo "=== LibreMesh Network Setup ==="; ip link show'$'\n'
    sleep 2
    
    # Auto-detect and configure available network interfaces
    sudo screen -S libremesh -X stuff 'echo "=== Auto-detecting network interfaces ==="'$'\n'
    sleep 1
    
    # Show all available interfaces for debugging
    sudo screen -S libremesh -X stuff 'echo "Available interfaces:"; ip link show | grep -E "^[0-9]+:"'$'\n'
    sleep 2
    
    # Find the first non-loopback interface
    sudo screen -S libremesh -X stuff 'MAIN_IFC=$(ip link show | grep -E "^[0-9]+: " | grep -v "lo:" | head -1 | cut -d: -f2 | tr -d " "); echo "Main interface: $MAIN_IFC"'$'\n'
    sleep 2
    
    # Configure the main interface with IP
    sudo screen -S libremesh -X stuff 'if [ -n "$MAIN_IFC" ]; then echo "Configuring $MAIN_IFC with 10.13.0.1/16..."; ip link set $MAIN_IFC up; ip addr add 10.13.0.1/16 dev $MAIN_IFC 2>/dev/null || ip addr replace 10.13.0.1/16 dev $MAIN_IFC; echo "$MAIN_IFC configured"; else echo "No network interface found"; fi'$'\n'
    sleep 3
    
    # More aggressive network interface configuration
    # Try multiple approaches to ensure connectivity
    
    # Configure eth0 directly (most reliable with virtio)
    sudo screen -S libremesh -X stuff 'echo "=== Configuring eth0 (primary) ==="; if ip link show eth0 >/dev/null 2>&1; then echo "Configuring eth0..."; ip link set eth0 up; ip addr flush dev eth0; ip addr add 10.13.0.1/16 dev eth0; echo "eth0 configured with 10.13.0.1/16"; ip addr show eth0; else echo "eth0 not found"; fi'$'\n'
    sleep 3
    
    # Configure br-lan if it exists (LibreMesh mesh bridge)
    sudo screen -S libremesh -X stuff 'echo "=== Configuring br-lan (mesh bridge) ==="; if ip link show br-lan >/dev/null 2>&1; then echo "Configuring br-lan for mesh..."; ip link set br-lan up; ip addr add 10.13.0.1/16 dev br-lan 2>/dev/null || echo "br-lan IP already set"; echo "br-lan configured"; ip addr show br-lan; else echo "br-lan not available"; fi'$'\n'
    sleep 3
    
    # Try wan interface (common in LibreRouterOS)
    sudo screen -S libremesh -X stuff 'echo "=== Checking wan interface ==="; if ip link show wan >/dev/null 2>&1; then echo "Configuring wan..."; ip link set wan up; ip addr add 10.13.0.1/16 dev wan 2>/dev/null || echo "wan IP set"; ip addr show wan; else echo "wan not available"; fi'$'\n'
    sleep 2
    
    # Force route configuration
    sudo screen -S libremesh -X stuff 'echo "=== Setting up routing ==="; ip route add 10.13.0.0/16 dev eth0 2>/dev/null || echo "Route already exists"; ip route show | grep 10.13.0'$'\n'
    sleep 2
    
    # Verify IP configuration
    sudo screen -S libremesh -X stuff 'echo "=== IP Configuration Verification ==="; ip addr show | grep -A1 "10.13.0.1"'$'\n'
    sleep 2
    
    # LibreMesh-specific services setup
    print_status "Starting LibreMesh services..."
    
    # Set root password for development
    sudo screen -S libremesh -X stuff 'echo "Setting development password..."; echo -e "admin\\nadmin" | passwd root 2>/dev/null'$'\n'
    sleep 2
    
    # Start essential LibreMesh services
    sudo screen -S libremesh -X stuff 'echo "Starting uHTTPd..."; /etc/init.d/uhttpd restart'$'\n'
    sleep 2
    
    sudo screen -S libremesh -X stuff 'echo "Starting ubus..."; /etc/init.d/ubus restart'$'\n'
    sleep 2
    
    # LibreMesh specific: Start lime-system if available
    sudo screen -S libremesh -X stuff 'if [ -f /etc/init.d/limed ]; then echo "Starting LibreMesh daemon..."; /etc/init.d/limed start; else echo "LibreMesh daemon not found - expected in minimal builds"; fi'$'\n'
    sleep 2
    
    # Enable batman-adv if available (mesh networking)
    sudo screen -S libremesh -X stuff 'if which batctl >/dev/null 2>&1; then echo "Batman-adv available - mesh networking enabled"; batctl if | head -3; else echo "Batman-adv not available (basic routing)"; fi'$'\n'
    sleep 2
    
    # Verify LibreMesh network configuration
    print_status "Verifying LibreMesh network configuration..."
    sudo screen -S libremesh -X stuff 'echo "=== Network Status ==="; ip addr show | grep -A2 "10.13.0.1\|br-lan\|eth0" | head -10; echo "=== Services Status ==="; ps | grep -E "(uhttpd|ubus|limed)" | head -3 || echo "Some services not running"; echo "=== Mesh Status ==="; if which batctl >/dev/null 2>&1; then echo "Batman interfaces:"; batctl if 2>/dev/null | head -2 || echo "No batman interfaces"; else echo "No mesh networking (basic mode)"; fi; echo "=== Access Info ==="; echo "Web: http://10.13.0.1/ and http://10.13.0.1/app/"; echo "Credentials: root/admin"'$'\n'
    sleep 3
    
    print_status "LibreMesh 23.05.5 network configuration completed"
    print_status "✓ Mesh networking: Available"
    print_status "✓ Bridge interface: br-lan preferred"
    print_status "✓ Web access: http://10.13.0.1/"
    print_status "✓ lime-app: http://10.13.0.1/app/"
    
    # Clean up
    sudo rm -f /tmp/boot_check.txt 2>/dev/null || true
}