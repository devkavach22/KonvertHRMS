# Stage 1: Build the application
FROM node:24-alpine

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application
# RUN npm run build

EXPOSE 3000

# Run the app
CMD ["npm", "run", "dev"]