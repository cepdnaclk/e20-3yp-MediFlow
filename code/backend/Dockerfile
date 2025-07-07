# Step 1: Use a Node.js base image
FROM node:22

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy package.json and package-lock.json
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the app
COPY . .

# Step 6: Expose the backend port
EXPOSE 5000

# Step 7: Start the backend app
CMD ["npm", "start"]