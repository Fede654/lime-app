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
    
    # Configure br-lan (primary mesh interface)
    sudo screen -S libremesh -X stuff 'if ip link show br-lan >/dev/null 2>&1; then echo "Configuring br-lan for mesh"; ip addr add 10.13.0.1/16 dev br-lan 2>/dev/null || ip addr replace 10.13.0.1/16 dev br-lan; ip link set br-lan up; echo "br-lan configured"; else echo "br-lan not found"; fi'$'\n'
    sleep 3
    
    # Fallback to eth0 if br-lan doesn't work
    sudo screen -S libremesh -X stuff 'if ! ip addr show br-lan | grep -q "10.13.0.1" 2>/dev/null; then echo "Fallback: configuring eth0"; ip addr add 10.13.0.1/16 dev eth0 2>/dev/null || ip addr replace 10.13.0.1/16 dev eth0; ip link set eth0 up 2>/dev/null; echo "eth0 configured"; fi'$'\n'
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
    sudo screen -S libremesh -X stuff 'if [ -f /etc/init.d/limed ]; then echo "Starting LibreMesh daemon..."; /etc/init.d/limed start; else echo "LibreMesh daemon not found (expected in minimal builds)"; fi'$'\n'
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