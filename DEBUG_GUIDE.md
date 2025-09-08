# WebRTC Debugging Guide

## Current Setup

Your WebRTC implementation now has:

1. **PeerJS Cloud Server**: Using `0.peerjs.com` for signaling
2. **Multiple STUN servers**: For NAT traversal
3. **Debug Level 3**: Maximum verbosity for PeerJS logs
4. **Delayed calling**: 1-second delay to ensure peer readiness
5. **Comprehensive logging**: Debug utilities for peer and call objects

## Testing Steps

### 1. Test Basic PeerJS Connectivity

Open `apps/movie-party-front/test-peer.html` in two browser tabs:

1. Note the peer IDs shown in each tab
2. In one tab, enter the other tab's peer ID
3. Click "Call" to test if basic PeerJS works
4. If this works, PeerJS itself is functioning

### 2. Check Console Output

With the new debug level, you should see:

```
PeerJS:  Socket open
PeerJS:  Server message received
✅ PeerJS connection opened with ID: [your-id]
🔍 PeerJS Debug Info
  Peer ID: [your-id]
  Peer disconnected: false
  Peer destroyed: false
```

### 3. Expected Flow

**First User:**

```
1. PeerJS connection opened
2. Got user media stream
3. Entering room
4. GET_PARTICIPANTS with 1 participant (self)
5. Waiting for others...
```

**Second User Joins:**

```
First User sees:
- USER_JOINED event
- Waiting for call

Second User sees:
- GET_PARTICIPANTS with 2 participants
- Initiating call to first user
- Call object created
- Should see "INCOMING CALL" on first user
```

## Common Issues and Solutions

### Issue 1: Calls Not Reaching Other Peer

**Symptoms:**

- "Initiating call" appears but no "INCOMING CALL" on other side
- No error messages

**Possible Causes:**

1. **Peer not ready**: The receiving peer's PeerJS connection isn't established
2. **Wrong peer ID**: The ID might have changed or be incorrect
3. **Firewall/Network**: Ports might be blocked

**Solutions:**

1. Verify both peers show "✅ PeerJS connection opened"
2. Check peer IDs match exactly
3. Test with the simple HTML test file first

### Issue 2: Stream Not Received After Call

**Symptoms:**

- Call connects but no "Successfully received stream" message
- Videos don't appear

**Possible Causes:**

1. **ICE candidates failing**: Network configuration issues
2. **Stream not properly attached**: Media stream issues

**Solutions:**

1. Check browser console for ICE candidate errors
2. Verify camera permissions are granted
3. Check if stream is valid before calling

### Issue 3: Multiple GET_PARTICIPANTS Events

**Symptoms:**

- Same participants list received multiple times
- Duplicate call attempts

**This is now fixed** by tracking processed participants

## Network Diagnostics

Run these checks:

1. **STUN Server Test:**

```javascript
// In browser console
const pc = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
});
pc.createDataChannel("test");
pc.createOffer().then((offer) => pc.setLocalDescription(offer));
pc.onicecandidate = (e) => {
    if (e.candidate) console.log("ICE Candidate:", e.candidate.candidate);
};
```

2. **Check PeerJS Server:**

```bash
curl https://0.peerjs.com/peerjs/id
```

3. **Browser WebRTC Support:**

- Chrome: chrome://webrtc-internals/
- Firefox: about:webrtc

## Quick Fixes to Try

1. **Clear Everything and Restart:**

```bash
# Stop all servers
# Clear browser cache and localStorage
# Restart servers
cd apps/movie-party-back && npm run dev
# In another terminal
cd apps/movie-party-front && npm run dev
```

2. **Use Different Browsers:**

- Test with Chrome + Firefox
- Try incognito/private mode
- Disable browser extensions

3. **Check Permissions:**

- Ensure camera access is granted
- Check site settings for localhost

4. **Simplify Testing:**

- Use the test-peer.html file first
- If that works, the issue is in the React app
- If that doesn't work, it's a network/browser issue

## What Changed in Your Code

1. **Removed problematic `isNewJoiner` flag**
2. **Added `processedParticipants` Set** to track connection attempts
3. **Fixed Room component** to prevent re-entering on state changes
4. **Added retry mechanism** for failed connections
5. **Enhanced debugging** with detailed logging
6. **Added delay** before calling to ensure peer readiness
7. **Using PeerJS cloud server** with explicit configuration
8. **Added proper cleanup** on component unmount

## Next Steps if Still Not Working

1. **Check if it's a timing issue:**
    - Increase the setTimeout delay from 1000ms to 2000ms
    - Add more logging to see exact timing of events

2. **Test with local PeerJS server:**

```bash
npm install -g peer
peerjs --port 9000 --key peerjs
```

Then change the Peer configuration to use localhost:9000

3. **Try WebRTC without PeerJS:**
    - Implement direct WebRTC with your own signaling
    - This would require more work but gives more control

4. **Check for race conditions:**
    - The stream might not be ready when answering
    - The peer might not be fully connected when calling

Let me know what you see in the console with the new debug output!
