# HVM-frontend/Dockerfile
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source files and .env
COPY . .

# Ensure the environment variable is available during build
ARG API_IP
ENV REACT_APP_API_URL=https://${API_IP:-localhost}:8000/api


# Create production build
RUN npm run build

# Production environment
FROM nginx:alpine

# Copy custom nginx config
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

COPY ./ssl/amrita.edu.cer /etc/nginx/ssl/amrita.edu.crt
COPY ./ssl/amrita.edu.key /etc/nginx/ssl/amrita.edu.key

# Copy built files from builder stage
COPY --from=builder /app/build /usr/share/nginx/html


EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
