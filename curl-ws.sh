#!/bin/bash
# Start the ws server on localhost:9001 and run this file; it should access the ws
curl --include \
     --no-buffer \
     --header "Connection: Upgrade" \
     --header "Upgrade: websocket" \
     --header "Host: localhost:9001" \
     --header "Origin: http://localhost:9001" \
     --header "Sec-WebSocket-Key: SGVsbG8sIHdvcmxkIQ==" \
     --header "Sec-WebSocket-Version: 13" \
     http://localhost:9001/