# WebSocket Troubleshooting Guide

## Quick Diagnosis Steps

### 1. **Check WebSocket Status in Console**
Open DevTools (F12) → Console and run:
```javascript
checkWebSocketStatus()
```

This will show:
- Connection status (connected/disconnected)
- The WebSocket URL being used
- Any error messages

### 2. **Check Network Tab**
1. Open DevTools (F12)
2. Go to **Network** tab
3. Filter by **WS** (WebSocket)
4. Look for a connection to `funint.site:8080`
5. Check the status:
   - ✅ **101 Switching Protocols** = Connected successfully
   - ❌ **Failed** or **Pending** = Connection issue

### 3. **Common Issues & Fixes**

#### Issue: WebSocket fails to connect to funint.site:8080
**Possible causes:**
- The remote server is not running
- Port 8080 is blocked/not accessible from your network
- Mixed content warning (HTTPS page trying WS connection)

**Solutions:**

**Option A: Disable WebSocket in Development**
Edit `.env.local`:
```env
VITE_REVERB_ENABLED=false
```
The app will work without real-time updates (useful for UI testing).

**Option B: Use a Local WebSocket Server**
If you have a local server running on port 8080:
```env
VITE_REVERB_HOST=localhost
VITE_REVERB_PORT=8080
VITE_REVERB_SCHEME=http
```

**Option C: Use HTTPS Locally (for WSS)**
```env
VITE_REVERB_SCHEME=https
VITE_REVERB_PORT=443
```

**Option D: Test Production Server**
```env
VITE_REVERB_HOST=funint.site
VITE_REVERB_PORT=8080
VITE_REVERB_SCHEME=http
```

### 4. **Verify Configuration**
Run this in console:
```javascript
// Get current WebSocket URL
getWebSocketURL()

// Check if connected
isWebSocketConnected()

// Check full config
console.log(window.__SUPER777_WS_STATUS__)
```

### 5. **Check Browser Logs**
Look for messages like:
- `"SUPER777 connecting Reverb WebSocket: ws://..."`
- `"WebSocket connected successfully"` ✅
- `"WebSocket connection error:"` ❌

## Common WebSocket Errors

| Error | Cause | Solution |
|-------|-------|----------|
| **ERR_CONNECTION_REFUSED** | Server not running | Check if server is accessible |
| **ERR_NETWORK_CHANGED** | Network connectivity issue | Check your internet connection |
| **ERR_NAME_NOT_RESOLVED** | DNS issue with hostname | Verify hostname is correct |
| **WebSocket is closed** | Connection dropped | Server disconnected or crashed |
| **Mixed Content Error** | HTTP ↔ HTTPS mismatch | Use correct VITE_REVERB_SCHEME |

## Testing Without WebSocket

If the server is not accessible, you can:

1. **Disable it temporarily:**
   ```env
   VITE_REVERB_ENABLED=false
   ```

2. **Or use mock data:**
   - Comment out websocket channel subscriptions
   - Test UI with static data

## Next Steps

1. Run `npm run dev`
2. Open the app in browser
3. Open DevTools (F12)
4. Run `checkWebSocketStatus()`
5. Share the output and Network tab info
6. I can help fix the specific issue!
