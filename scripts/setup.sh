#!/bin/bash

echo " Setting up API Monitor Dashboard..."


if ! command -v docker &> /dev/null; then
    echo " Docker is not installed. Please install Docker first."
    exit 1
fi


if ! command -v docker-compose &> /dev/null; then
    echo " Docker Compose is not installed. Please install Docker Compose."
    exit 1
fi


echo " Creating project structure..."
mkdir -p frontend/src/components
mkdir -p frontend/src/services
mkdir -p api-gateway/src/routes
mkdir -p monitor-service/src


if [ ! -f .env ]; then
    echo " Creating .env file from example..."
    cp .env.example .env
    echo " Please edit the .env file with your configuration"
fi

echo " Building and starting Docker containers..."
docker-compose up --build -d


echo " Waiting for services to be ready..."
sleep 10


echo " Checking service status..."
if curl -s http://localhost:3000 > /dev/null; then
    echo " Frontend is running at http://localhost:3000"
else
    echo " Frontend failed to start"
fi

if curl -s http://localhost:3001/api-docs > /dev/null; then
    echo " API Gateway is running at http://localhost:3001"
else
    echo " API Gateway failed to start"
fi

if curl -s http://localhost:5000/health > /dev/null; then
    echo " Monitor Service is running at http://localhost:5000"
else
    echo " Monitor Service failed to start"
fi

echo ""
echo " Setup complete! Your API Monitor Dashboard is ready."
echo ""
echo " Access URLs:"
echo "   Frontend:      http://localhost:3000"
echo "   API Gateway:   http://localhost:3001"
echo "   Monitor Service: http://localhost:5000"
echo "   pgAdmin:       http://localhost:5050"
echo ""
echo "  Commands:"
echo "   Start:         docker-compose up -d"
echo "   Stop:          docker-compose down"
echo "   Logs:          docker-compose logs -f"
echo "   Rebuild:       docker-compose up --build -d"
