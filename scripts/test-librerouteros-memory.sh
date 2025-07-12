#!/usr/bin/env bash
#
# Test LibreRouterOS with different memory allocations
#

LIME_PACKAGES_DIR="../lime-packages"
ROOTFS_PATH="$LIME_PACKAGES_DIR/build/librerouteros-24.10.1-r28597-0425664679-x86-64-rootfs.tar.gz"
KERNEL_PATH="$LIME_PACKAGES_DIR/build/librerouteros-24.10.1-r28597-0425664679-x86-64-generic-kernel.bin"

print_status() {
    echo -e "\033[0;32m[INFO]\033[0m $1"
}

test_memory_allocation() {
    local mem_size="$1"
    
    print_status "Testing with ${mem_size}MB memory..."
    
    # Create test initrd
    temp_dir="/tmp/librerouteros_mem_test"
    rm -rf "$temp_dir"
    mkdir -p "$temp_dir"
    tar -xf "$ROOTFS_PATH" -C "$temp_dir" 2>/dev/null
    (cd "$temp_dir" && find . | cpio --quiet -o -H newc > /tmp/librerouteros_mem_test.cpio 2>/dev/null)
    
    # Test with specified memory
    timeout 15 qemu-system-x86_64 \
        -m "$mem_size" \
        -nographic \
        -no-reboot \
        -kernel "$KERNEL_PATH" \
        -initrd /tmp/librerouteros_mem_test.cpio \
        -append "console=ttyS0,115200 panic=5" \
        2>&1 | head -15 | sed 's/^/  /'
    
    echo
    
    # Cleanup
    rm -rf "$temp_dir" /tmp/librerouteros_mem_test.cpio
}

cd /home/fede/REPOS/lime-build/lime-app

print_status "LibreRouterOS Memory Allocation Test"
print_status "===================================="
echo

# Test different memory sizes
for mem in 64 128 256 512; do
    test_memory_allocation "$mem"
done

print_status "Test completed!"