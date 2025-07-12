#!/usr/bin/env bash
#
# Debug LibreRouterOS Boot Issues
# Tests different QEMU configurations and boot parameters
#

set -e

LIME_PACKAGES_DIR="../lime-packages"
ROOTFS_PATH="$LIME_PACKAGES_DIR/build/librerouteros-24.10.1-r28597-0425664679-x86-64-rootfs.tar.gz"
KERNEL_PATH="$LIME_PACKAGES_DIR/build/librerouteros-24.10.1-r28597-0425664679-x86-64-generic-kernel.bin"

print_status() {
    echo -e "\033[0;32m[INFO]\033[0m $1"
}

print_error() {
    echo -e "\033[0;31m[ERROR]\033[0m $1"
}

print_warning() {
    echo -e "\033[1;33m[WARN]\033[0m $1"
}

# Test 1: Basic kernel information
test_kernel_info() {
    print_status "=== Kernel Analysis ==="
    
    print_status "Kernel file info:"
    file "$KERNEL_PATH"
    
    print_status "Kernel size: $(du -h "$KERNEL_PATH" | cut -f1)"
    
    print_status "Looking for kernel version in strings:"
    strings "$KERNEL_PATH" | grep -E "(6\.6\.86|Linux version)" | head -3 || echo "No version found"
    
    print_status "Looking for kernel command line:"
    strings "$KERNEL_PATH" | grep -E "(console=|root=|quiet|panic=)" | head -5 || echo "No command line found"
}

# Test 2: Rootfs analysis
test_rootfs_info() {
    print_status "=== Rootfs Analysis ==="
    
    print_status "Rootfs file info:"
    file "$ROOTFS_PATH"
    
    print_status "Rootfs size: $(du -h "$ROOTFS_PATH" | cut -f1)"
    
    print_status "Key system files:"
    tar -tf "$ROOTFS_PATH" | grep -E "^\\./sbin/init$|^\\./bin/busybox$|^\\./etc/inittab$" || echo "Some files missing"
    
    print_status "Boot-related files:"
    tar -tf "$ROOTFS_PATH" | grep -E "(init\\.d/boot|preinit|rc\\.)" | head -5 || echo "No boot files found"
}

# Test 3: Try minimal QEMU boot
test_minimal_qemu() {
    print_status "=== Minimal QEMU Test ==="
    
    print_status "Creating minimal rootfs for test..."
    
    # Create minimal test environment
    temp_dir="/tmp/librerouteros_debug"
    rm -rf "$temp_dir"
    mkdir -p "$temp_dir"
    
    # Extract just essential files
    tar -xf "$ROOTFS_PATH" -C "$temp_dir" 2>/dev/null || {
        print_error "Failed to extract rootfs"
        return 1
    }
    
    print_status "Rootfs extracted, creating minimal initrd..."
    
    # Create cpio
    (cd "$temp_dir" && find . | cpio --quiet -o -H newc > /tmp/librerouteros_debug.cpio 2>/dev/null)
    
    print_status "Testing minimal QEMU boot (10 second timeout)..."
    
    # Test with minimal QEMU options
    timeout 10 qemu-system-x86_64 \
        -m 64 \
        -nographic \
        -no-reboot \
        -kernel "$KERNEL_PATH" \
        -initrd /tmp/librerouteros_debug.cpio \
        -append "console=ttyS0 panic=1" \
        2>&1 | head -20 || {
        print_warning "QEMU test timed out or failed (expected)"
    }
    
    # Cleanup
    rm -rf "$temp_dir" /tmp/librerouteros_debug.cpio
}

# Test 4: Compare with working LibreMesh
test_compare_with_libremesh() {
    print_status "=== Comparison with LibreMesh ==="
    
    local libremesh_kernel="$LIME_PACKAGES_DIR/build/libremesh-2024.1-ow23.05.5-default-x86-64-generic-initramfs-kernel.bin"
    
    if [ -f "$libremesh_kernel" ]; then
        print_status "LibreMesh kernel info:"
        file "$libremesh_kernel"
        
        print_status "Size comparison:"
        echo "  LibreRouterOS: $(du -h "$KERNEL_PATH" | cut -f1)"
        echo "  LibreMesh:     $(du -h "$libremesh_kernel" | cut -f1)"
        
        print_status "Version comparison:"
        echo "  LibreRouterOS:"
        strings "$KERNEL_PATH" | grep -E "(6\.6\.86)" | head -1 || echo "    No version found"
        echo "  LibreMesh:"
        strings "$libremesh_kernel" | grep -E "(5\.15\.167)" | head -1 || echo "    No version found"
    else
        print_warning "LibreMesh kernel not found for comparison"
    fi
}

# Test 5: Try different boot parameters
test_boot_parameters() {
    print_status "=== Testing Different Boot Parameters ==="
    
    local test_params=(
        "console=ttyS0,115200 panic=1 quiet"
        "console=ttyS0 root=/dev/ram0 rw"
        "console=ttyS0 init=/sbin/init rw"
        "console=ttyS0,115200 rootfstype=tmpfs panic=1"
    )
    
    # Create test initrd
    temp_dir="/tmp/librerouteros_test"
    rm -rf "$temp_dir"
    mkdir -p "$temp_dir"
    tar -xf "$ROOTFS_PATH" -C "$temp_dir" 2>/dev/null
    (cd "$temp_dir" && find . | cpio --quiet -o -H newc > /tmp/librerouteros_test.cpio 2>/dev/null)
    
    for params in "${test_params[@]}"; do
        print_status "Testing with parameters: $params"
        
        timeout 8 qemu-system-x86_64 \
            -m 64 \
            -nographic \
            -no-reboot \
            -kernel "$KERNEL_PATH" \
            -initrd /tmp/librerouteros_test.cpio \
            -append "$params" \
            2>&1 | head -10 | sed 's/^/  /' || {
            print_warning "Test with '$params' timed out"
        }
        echo
    done
    
    # Cleanup
    rm -rf "$temp_dir" /tmp/librerouteros_test.cpio
}

# Test 6: Check for missing dependencies
test_dependencies() {
    print_status "=== Checking Dependencies ==="
    
    print_status "Essential system files in rootfs:"
    tar -tf "$ROOTFS_PATH" | grep -E "^\\./lib/.*\\.so|^\\./usr/lib/.*\\.so" | wc -l | sed 's/^/  Shared libraries: /'
    
    tar -tf "$ROOTFS_PATH" | grep -E "^\\./lib/modules/" | head -3 | sed 's/^/  Kernel modules: /' || echo "  Kernel modules: None found"
    
    tar -tf "$ROOTFS_PATH" | grep -E "^\\./etc/init\\.d/" | wc -l | sed 's/^/  Init scripts: /'
    
    print_status "Critical files check:"
    for file in "./sbin/init" "./bin/busybox" "./bin/ash" "./etc/passwd" "./etc/inittab"; do
        if tar -tf "$ROOTFS_PATH" | grep -q "^$file$"; then
            echo "  ✓ $file"
        else
            echo "  ✗ $file (missing)"
        fi
    done
}

# Main execution
main() {
    cd "$LIME_PACKAGES_DIR"
    
    print_status "LibreRouterOS Boot Investigation"
    print_status "================================"
    
    # Check prerequisites
    if [ ! -f "$KERNEL_PATH" ]; then
        print_error "Kernel not found: $KERNEL_PATH"
        exit 1
    fi
    
    if [ ! -f "$ROOTFS_PATH" ]; then
        print_error "Rootfs not found: $ROOTFS_PATH"
        exit 1
    fi
    
    # Run all tests
    test_kernel_info
    echo
    test_rootfs_info
    echo
    test_dependencies
    echo
    test_compare_with_libremesh
    echo
    test_minimal_qemu
    echo
    test_boot_parameters
    
    print_status "Investigation completed!"
    print_status "Check output above for clues about the boot issue."
}

# Command handling
case "${1:-all}" in
    kernel)
        cd "$LIME_PACKAGES_DIR"
        test_kernel_info
        ;;
    rootfs)
        cd "$LIME_PACKAGES_DIR"
        test_rootfs_info
        ;;
    minimal)
        cd "$LIME_PACKAGES_DIR"
        test_minimal_qemu
        ;;
    compare)
        cd "$LIME_PACKAGES_DIR"
        test_compare_with_libremesh
        ;;
    boot)
        cd "$LIME_PACKAGES_DIR"
        test_boot_parameters
        ;;
    deps)
        cd "$LIME_PACKAGES_DIR"
        test_dependencies
        ;;
    all)
        main
        ;;
    help|--help|-h)
        echo "Usage: $0 {all|kernel|rootfs|minimal|compare|boot|deps}"
        echo ""
        echo "Commands:"
        echo "  all      - Run all tests (default)"
        echo "  kernel   - Analyze kernel file"
        echo "  rootfs   - Analyze rootfs contents"
        echo "  minimal  - Test minimal QEMU boot"
        echo "  compare  - Compare with LibreMesh"
        echo "  boot     - Test different boot parameters"
        echo "  deps     - Check dependencies"
        ;;
    *)
        print_error "Unknown command: $1"
        exit 1
        ;;
esac