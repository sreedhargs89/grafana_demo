# Base image - Using Node.js 18 LTS
FROM node:18-slim

# Set working directory inside the container
# This is where our application code will live
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first
# This is a best practice that allows us to leverage Docker cache layers
# If these files don't change, npm install won't run again in subsequent builds
COPY package*.json ./

# Install dependencies
# Using npm ci instead of npm install for more reliable builds
# install dependencies (using install instead of ci since package-lock.json might not exist)
RUN npm install

# Copy application source code
# This step is separated from copying package files to leverage caching
COPY . .

# Expose the port the app will run on
# This is documentation for users of the image and doesn't actually publish the port
EXPOSE 3000

# Define health check to verify the application is running correctly
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Set Node.js to run in production mode for better performance
ENV NODE_ENV=production

# Command to run the application
# Using node directly rather than npm scripts for better signal handling
CMD ["node", "app.js"]

