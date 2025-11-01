#!/bin/bash
# Server restart script that handles port conflicts

echo "🛑 Stopping existing server processes..."

# Kill any process using port 3000
lsof -ti :3000 | xargs kill -9 2>/dev/null

# Kill any node server.js processes
pkill -9 -f "node server.js" 2>/dev/null

# Wait for port to be released
sleep 2

# Check if port is free
if lsof -i :3000 >/dev/null 2>&1; then
    echo "⚠️  Port 3000 still in use. Force killing..."
    lsof -ti :3000 | xargs kill -9 2>/dev/null
    sleep 1
fi

echo "🚀 Starting server..."

# Navigate to server directory
cd "$(dirname "$0")"

# Start server in background
npm run dev > /tmp/server.log 2>&1 &

# Wait a moment
sleep 2

# Check if server started successfully
if curl -s http://localhost:3000/health >/dev/null 2>&1; then
    echo "✅ Server started successfully!"
    echo "📡 Health check: http://localhost:3000/health"
    echo "📚 API: http://localhost:3000/api"
    echo "📝 Logs: tail -f /tmp/server.log"
else
    echo "⚠️  Server may still be starting. Check logs: tail -f /tmp/server.log"
fi

