# LibreRouterOS Kernel Investigation - SOLVED ✅

## 🎯 **Problem Summary**

LibreRouterOS 24.10.1 with kernel 6.6.86 was failing to boot in QEMU, appearing to hang after "Booting from ROM..". The investigation revealed this was **not** a hang, but a **root filesystem mounting issue**.

## 🔍 **Investigation Process**

### **Phase 1: Initial Analysis**
- **Kernel Version**: LibreRouterOS 6.6.86 vs LibreMesh 5.15.167
- **File Size**: LibreRouterOS 5.9M vs LibreMesh 11M (smaller, suggesting minimal config)
- **Build Date**: LibreRouterOS built 2025-04-13 (very recent)
- **Initial Symptom**: Apparent hang after BIOS messages

### **Phase 2: Deep Investigation**
Using `debug-librerouteros-boot.sh`, we discovered:

1. **All critical files present**: `/sbin/init`, `/bin/busybox`, `/bin/ash`, `/etc/inittab`
2. **Kernel modules available**: 104 shared libraries, kernel modules for 6.6.86
3. **Memory not the issue**: Tested 64MB to 512MB with same results

### **Phase 3: Verbose Boot Analysis**
With debug logging (`loglevel=8`), the **real issue** was revealed:

```bash
[    1.331022] /dev/root: Can't open blockdev
[    1.331517] VFS: Cannot open root device "" or unknown-block(0,0): error -6
[    1.331578] Please append a correct "root=" boot option
[    1.332269] Kernel panic - not syncing: VFS: Unable to mount root fs on unknown-block(0,0)
```

## 🚀 **Root Cause**

**LibreRouterOS kernel 6.6.86 expects different boot parameters than LibreMesh 5.15.167**:

- **LibreMesh 5.15.167**: Works with default OpenWrt initrd parameters
- **LibreRouterOS 6.6.86**: Requires explicit `rdinit=/sbin/init` parameter

## ✅ **Solution Implemented**

### **Custom QEMU Launcher**
Created `/home/fede/REPOS/lime-build/lime-packages/tools/qemu_dev_start_librerouteros` with:

```bash
# Key changes from standard qemu_dev_start:
-m 256                                    # Increased memory from 128MB
-append "console=ttyS0,115200 rdinit=/sbin/init panic=10"  # Critical: rdinit parameter
```

### **Integrated Configuration System**
Updated `qemu-manager.sh` to automatically detect LibreRouterOS and use appropriate launcher:

```bash
if [[ "$IMAGE_TYPE" == "librerouteros-2410" ]]; then
    sudo screen -dmS libremesh ./tools/qemu_dev_start_librerouteros
else
    sudo screen -dmS libremesh ./tools/qemu_dev_start  # Standard LibreMesh
fi
```

## 🧪 **Test Results**

### **Before Fix**
```bash
# Kernel panic - unable to mount root filesystem
[    1.332269] Kernel panic - not syncing: VFS: Unable to mount root fs
```

### **After Fix**
```bash
# ✅ Successful boot and network connectivity
$ ping 10.13.0.1
64 bytes from 10.13.0.1: icmp_seq=1 ttl=64 time=0.241 ms

# ✅ Web interface working
$ curl http://10.13.0.1/
<!DOCTYPE html>...OpenWrt interface...

# ✅ lime-app working  
$ curl http://10.13.0.1/app/
<!DOCTYPE html>...LiMe-abc000...
```

## 🎉 **Final Status**

### **✅ LibreRouterOS 24.10.1 - WORKING**
- **Boot**: ✅ Successful with custom boot parameters
- **Network**: ✅ Configured at 10.13.0.1
- **Web Interface**: ✅ OpenWrt LuCI accessible
- **lime-app**: ✅ Deployed and functional
- **File Overlay**: ✅ lime-packages integration working

### **✅ LibreMesh 23.05.5 - WORKING** 
- **Boot**: ✅ Successful with standard parameters
- **Network**: ✅ Mesh configuration applied
- **Web Interface**: ✅ LibreMesh interface accessible
- **lime-app**: ✅ Deployed and functional

## 🔧 **Usage**

### **Use LibreRouterOS (Fresh Build)**
```bash
npm run qemu:start:librerouteros
# or
QEMU_IMAGE_CONFIG=librerouteros-2410 npm run qemu:start
```

### **Use LibreMesh (Stable)**
```bash
npm run qemu:start:libremesh  
# or
QEMU_IMAGE_CONFIG=libremesh-2305 npm run qemu:start
```

### **Deploy lime-app to Either**
```bash
npm run deploy:qemu
```

## 📋 **Technical Details**

### **Key Differences**

| Aspect | LibreMesh 5.15.167 | LibreRouterOS 6.6.86 |
|--------|-------------------|----------------------|
| **Kernel Version** | 5.15.167 (OpenWrt 23.05) | 6.6.86 (Custom build) |
| **Size** | 11M | 5.9M |
| **Boot Parameter** | Default initrd | `rdinit=/sbin/init` |
| **Memory** | 128MB | 256MB |
| **Architecture** | LibreMesh mesh-optimized | LibreRouterOS base |

### **Boot Parameter Evolution**
- **Older kernels (5.15.x)**: Automatically find and mount initrd
- **Newer kernels (6.6.x)**: Require explicit `rdinit=` parameter for initrd-based systems

### **Why This Worked**
1. **rdinit=/sbin/init**: Tells kernel to use initrd as root and run `/sbin/init`
2. **console=ttyS0,115200**: Proper serial console for QEMU
3. **panic=10**: 10-second panic timeout for debugging
4. **256MB memory**: Adequate for kernel 6.6.86 requirements

## 🔮 **Future Considerations**

### **Kernel Version Management**
- OpenWrt 24.x will likely use newer kernels requiring similar boot parameter adjustments
- Consider automated detection based on kernel version strings

### **Performance Optimization**
- LibreRouterOS 6.6.86 may have different performance characteristics
- Monitor memory usage and adjust QEMU parameters as needed

### **Feature Differences**
- LibreRouterOS may have different service configurations than LibreMesh
- Network setup scripts may need image-specific adjustments

---

## 🎯 **Summary**

**Problem**: LibreRouterOS kernel 6.6.86 failed to boot due to root filesystem mounting issues
**Root Cause**: Newer kernel requires explicit `rdinit=/sbin/init` boot parameter  
**Solution**: Custom QEMU launcher with proper boot parameters
**Result**: Both LibreMesh and LibreRouterOS configurations now working perfectly

**Your fresh LibreRouterOS build is working perfectly for lime-app development!** 🚀