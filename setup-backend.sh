#!/bin/bash

# Install backend dependencies
pip install -r backend/requirements.txt

# Create .env file (user must add their API key)
if [ ! -f backend/.env ]; then
    echo "Creating .env file from template..."
    cp backend/.env.example backend/.env
    echo "⚠️  Please edit backend/.env and add your OpenAI API key"
else
    echo "✓ backend/.env already exists"
fi

echo "Backend setup complete!"
