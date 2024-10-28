# Step 1: Build the application
# Use an official Node image as the base for the build
FROM node:22.10.0 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json (or yarn.lock) to the working directory
COPY package*.json ./

# Install dependencies with legacy peer dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application to the container
COPY . .

# Build the React app
RUN npm run build

# Step 2: Use a lightweight Node server to serve the built app
# Start from a lightweight Node image
FROM node:alpine

# Install a static file server (like "serve") globally
RUN npm install -g serve

# Copy the build folder from the previous stage
COPY --from=build /app/build /app/build

# Expose port 3000 to allow traffic
EXPOSE 3000

# Serve the application with the "serve" command
CMD ["serve", "-s", "/app/build", "-l", "3000"]
