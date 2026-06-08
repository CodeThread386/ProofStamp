#!/bin/bash
echo "Starting all services..."
npx concurrently \
  "cd server && npm run dev" \
  "cd client && npm run dev" \
  "cd stego-service && source venv/bin/activate && uvicorn main:app --host 0.0.0.0 --port 8000 --reload"
