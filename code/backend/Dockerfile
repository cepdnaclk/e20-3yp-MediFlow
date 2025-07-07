# backend/Dockerfile
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install all dependencies including devDependencies (like nodemon)
RUN npm install

# Copy remaining app source code
COPY . .

# Expose backend port
EXPOSE 5000

# Start development server using nodemon
CMD ["npm", "run", "dev"]
