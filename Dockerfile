# Stage 1: Build Angular Frontend
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Stage 2: Production Server
FROM node:20-alpine
WORKDIR /app

# Copy Server Code
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm install --production

COPY server/ ./

# Copy Angular Build from Stage 1
# Ensure the path matches angular.json output path
COPY --from=build /app/dist/emiShop/browser ../dist/emiShop/browser

# Expose Port
EXPOSE 3001

# Start Server
CMD ["node", "server.js"]
