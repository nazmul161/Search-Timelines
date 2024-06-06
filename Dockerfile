FROM node:16.16.0

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install the application's dependencies
RUN npm install

# Copy the rest of the application's files to the container
COPY . .

# Change the working directory to the "frontend" folder
## uncomment when you want to run the backend and frontend together
##WORKDIR /app/frontend

# Install the dependencies for the "frontend" folder
## uncomment when you want to run the backend and frontend together
##RUN npm install --legacy-peer-deps

# Change the working directory back to root
## uncomment when you want to run the backend and frontend together
##WORKDIR /app

# Expose ports for the frontend and backend
## uncomment when you want to run the backend and frontend together
##EXPOSE 3000
EXPOSE 5000

# Start the application
CMD ["npm", "run", "server"]