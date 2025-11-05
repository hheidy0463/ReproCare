#!/bin/bash

# Setup script for ReproCare MVP

echo "Setting up ReproCare..."

# Create env files if they don't exist
if [ ! -f .env.api ]; then
    touch .env.api
    echo "Created .env.api (empty - will use defaults)"
fi

if [ ! -f .env.web ]; then
    touch .env.web
    echo "Created .env.web (empty - will use defaults)"
fi

# Initialize database
echo ""
echo "Initializing database..."
cd api
if [ ! -f ../api/.env ]; then
    echo "DATABASE_URL=sqlite:///./mvp.sqlite" > .env
    echo "Created api/.env"
fi

# Install Python dependencies
echo ""
echo "Installing Python dependencies..."
if pip install -e .; then
    echo "✓ Dependencies installed"
else
    echo "✗ Failed to install dependencies. Please run: pip install -e ."
    exit 1
fi

# Run seed script
echo ""
echo "Creating database tables..."
python -m app.seed

cd ..

echo ""
echo "✓ Setup complete!"
echo ""
echo "To start the application:"
echo "  Docker: docker-compose up --build"
echo "  Local:  See README.md for instructions"

