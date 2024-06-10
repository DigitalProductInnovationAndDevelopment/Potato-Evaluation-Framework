# Backend Dockerfile

# Use the official Node.js image as a base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

COPY scripts/seed.js ./scripts/seed.js
COPY scripts/start.js ./scripts/start.js

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose the port the application runs on
EXPOSE 8080

# Command to run the application
CMD ["node", "scripts/start.js"]

