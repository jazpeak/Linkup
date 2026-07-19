FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (only production)
RUN npm ci

# Copy the rest of the application
COPY . .

# Expose port
EXPOSE 5001

# Start the application
CMD ["npm", "start"]
