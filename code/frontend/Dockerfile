# Step 1: Use a Node.js base image to build the app
FROM node:20-alpine as build

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy package files and install dependencies
COPY package*.json ./
RUN npm install
# Explicitly install TypeScript 5.0+ to support "bundler" moduleResolution
RUN npm install typescript@latest --save-dev

# Step 4: Copy tsconfig files first to ensure proper path resolution
COPY tsconfig*.json ./
COPY vite.config.ts ./

# Step 5: Create the lib/utils.ts file with its directory
RUN mkdir -p src/lib
RUN echo 'import { clsx, type ClassValue } from "clsx"; import { twMerge } from "tailwind-merge"; export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }' > src/lib/utils.ts

# Step 6: Copy the rest of the application code
COPY . .

# Step 7: Build the React app
RUN npm run build

# Step 8: Use an Nginx container to serve the React build
FROM nginx:alpine

# Step 9: Copy the build output to Nginx's serving directory
COPY --from=build /app/dist /usr/share/nginx/html

# Step 10: Copy a custom nginx configuration if needed
# COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Step 11: Expose the Nginx port
EXPOSE 80

# Step 12: Start Nginx server
CMD ["nginx", "-g", "daemon off;"]