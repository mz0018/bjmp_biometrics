# Use official Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install --production

# Copy the rest of the backend code
COPY . .

# Expose backend port (change if not 5000)
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
