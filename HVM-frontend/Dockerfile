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

# Step 2: Serve the built app with NGINX
# Use an official NGINX image as the base for the production deployment
FROM nginx:alpine

# Copy the build folder from the previous stage to NGINX's HTML folder
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 to allow traffic
EXPOSE 80

# Start NGINX server
CMD ["nginx", "-g", "daemon off;"]
