# Testing WebRTC Peer Connections

## How to Test

1. **Start the backend server:**

    ```bash
    cd apps/movie-party-back
    npm run dev
    ```

2. **Start the frontend dev server:**

    ```bash
    cd apps/movie-party-front
    npm run dev
    ```

3. **Open browser developer console** for debugging output

4. **Test with 2 users:**
    - Open first browser tab at http://localhost:5173
    - Click "Create Room"
    - Copy the room URL
    - Open second browser tab (or incognito window)
    - Navigate to the same room URL
    - Check console logs for connection flow

5. **Test with 3+ users:**
    - After 2 users are connected
    - Open third browser tab
    - Navigate to the same room URL
    - All users should connect to each other

## Expected Console Output Flow

### First User (Creates Room):

```
Entering room: [roomId] with peer ID: [peerId]
=== GET_PARTICIPANTS RECEIVED ===
Room: [roomId]
All participants: ['first-user-id']
My ID: first-user-id
Currently connected peers: []
Previously processed: []
No new participants to connect with
```

### Second User Joins:

```
Entering room: [roomId] with peer ID: [peerId]
=== GET_PARTICIPANTS RECEIVED ===
Room: [roomId]
All participants: ['first-user-id', 'second-user-id']
My ID: second-user-id
Currently connected peers: []
Previously processed: []
Found new participants to connect with: ['first-user-id']
>>> Initiating call to peer: first-user-id
<<< Successfully received stream from peer: first-user-id
```

### First User (when second joins):

```
=== USER_JOINED EVENT ===
New user joined: second-user-id
My ID: first-user-id
Existing user waiting for new peer second-user-id to call me

=== INCOMING CALL ===
Receiving call from: second-user-id
>>> Answering call from: second-user-id
<<< Received stream from caller: second-user-id
```

## Troubleshooting

### If peers don't connect:

1. **Check PeerJS server:** Ensure peers can establish signaling
2. **Check WebRTC permissions:** Camera/microphone access must be granted
3. **Check network:** Both peers must be on same network or have proper STUN/TURN config
4. **Clear browser cache:** Sometimes stale connections persist

### Debug tips:

- The `processedParticipants` Set tracks which peers we've attempted to connect to
- If a call fails, the peer is removed from `processedParticipants` for retry
- Each peer should only initiate calls to peers that joined before them
- The GET_PARTICIPANTS event is sent to all users when anyone joins/leaves

## Key Changes Made:

1. **Removed `isNewJoiner` flag:** Was causing issues with multiple GET_PARTICIPANTS events
2. **Added `processedParticipants` Set:** Tracks which peers we've attempted connections with
3. **Fixed Room component dependencies:** Prevents re-entering room on state changes
4. **Added retry logic:** Failed connections are retried by removing from processed set
5. **Improved logging:** Clear console output shows connection flow
6. **Added peer video display:** Visual confirmation of connected peers
