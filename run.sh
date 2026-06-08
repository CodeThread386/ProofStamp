#!/bin/bash
# run.sh

# Install concurrently globally if needed or use npx
echo "Installing dependencies for all services..."

# Server
echo "Installing server dependencies..."
cd server
npm install
cd ..

# Client
echo "Installing client dependencies..."
cd client
npm install
cd ..

# Stego Service
echo "Installing stego-service dependencies..."
cd stego-service
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ..

echo "Starting all services..."
npx concurrently \
  "cd server && npm run dev" \
  "cd client && npm run dev" \
  "cd stego-service && source venv/bin/activate && uvicorn main:app --host 0.0.0.0 --port 8000 --reload"
