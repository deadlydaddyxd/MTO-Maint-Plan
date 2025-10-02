#!/bin/bash

# Setup Users Script for Railway Deployment
echo "🌱 Setting up default users for MTO Maintenance System..."
echo "🔄 Running user seeder..."

# Run the user seeder
npm run seed:users

echo "✅ User setup completed!"
echo "🔐 Default login credentials have been created"