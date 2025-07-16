# CRITICAL BACKEND FIXES NEEDED

## 🚨 URGENT: Bugs found in lime-packages/packages/ubus-lime-metrics/files/usr/sbin/last_internet

**Root cause of "No gateway available" errors identified and fixed.**

### Bug 1: Undefined variable in BMX6 section (Line 17)
```bash
# BROKEN (current):
if [[ -f '/usr/lib/opkg/info/lime-proto-bmx6.control' ]]; then 
    default_dev=`ip r | grep "default dev" | cut -d' ' -f3`;
    gw=`bmx6 -c show tunnels | grep $default_dev | grep inet4 | awk '{ print $10 }'`;
    for node in `mtr -6 -r -c 1 $gw.mesh  | grep "\.|" |  awk '{ print $2}' | cut -d'.' -f1`; do
            nodename=$(wget --no-check-certificate http://$path/cgi-bin/hostname -qO -)  # ❌ $path is undefined!
            path="$path,{\"ip\":\"$node\",\"hostname\":\"$nodename\"}"
    done

# FIXED:
if [[ -f '/usr/lib/opkg/info/lime-proto-bmx6.control' ]]; then 
    path=''  # ✅ Initialize path variable
    default_dev=`ip r | grep "default dev" | cut -d' ' -f3`;
    gw=`bmx6 -c show tunnels | grep $default_dev | grep inet4 | awk '{ print $10 }'`;
    for node in `mtr -6 -r -c 1 $gw.mesh  | grep "\.|" |  awk '{ print $2}' | cut -d'.' -f1`; do
            nodename=$(wget --no-check-certificate http://$node/cgi-bin/hostname -qO -)  # ✅ Use $node instead of $path
            path="$path,{\"ip\":\"$node\",\"hostname\":\"$nodename\"}"
    done
```

### Bug 2: Missing file existence check (Line 41)
```bash
# BROKEN (current):
oldSum=$(md5sum /etc/last_internet_path | cut -d' ' -f 1)  # ❌ Fails if file doesn't exist

# FIXED:
if [ -f /etc/last_internet_path ]; then
    oldSum=$(md5sum /etc/last_internet_path | cut -d' ' -f 1)
else
    oldSum=""  # ✅ Handle missing file gracefully
fi
```

### Bug 3: Grammar fix
```bash
# BROKEN:
logger 'Last path to internet has no changed'

# FIXED:
logger 'Last path to internet has not changed'
```

## Impact
These bugs prevented the cron job `/usr/sbin/last_internet save` from working correctly, causing:
- No `/etc/last_internet_path` file generation
- lime-metrics.get_gateway() always returning "No gateway available" error
- Broken internet path detection in lime-app

## Fix Required
Apply these changes to: `lime-packages/packages/ubus-lime-metrics/files/usr/sbin/last_internet`

## Verification Commands
```bash
# Test the script manually
/usr/sbin/last_internet save

# Check if file was created
ls -la /etc/last_internet_path

# Verify cron job exists
cat /etc/crontabs/root | grep last_internet

# Test lime-metrics API
ubus call lime-metrics get_gateway
```