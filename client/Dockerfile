# # FROM node:alpine 

# # WORKDIR /app
# # COPY package.json package-lock.json ./
# # RUN npm install
# # COPY . .

# # CMD ["npm","start"]
# # 1. Use official Node image
# FROM node:18-alpine AS builder

# # 2. Set working directory
# WORKDIR /app

# # 3. Install dependencies
# COPY package.json package-lock.json ./
# RUN npm install

# # 4. Copy the rest of the code
# COPY . .

# # 5. Build the Next.js app
# RUN npm run build

# # # 6. Use a lightweight image to serve the app
# # FROM node:18-alpine AS runner
# # WORKDIR /app

# # # Only copy necessary files for production
# # COPY --from=builder /app/package.json ./
# # COPY --from=builder /app/node_modules ./node_modules
# # COPY --from=builder /app/.next .next
# # COPY --from=builder /app/public ./public

# # ENV NODE_ENV production

# # EXPOSE 3000
# # CMD ["npm", "start"]
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# Run stage
FROM node:18-alpine AS runner

WORKDIR /app

# Copy production files
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["npx", "next", "start"]
# FROM node:alpine

# WORKDIR /app
# COPY package.json .
# RUN npm install
# COPY . .

# # CMD ["npm", "run", "dev"]
# CMD ["npx", "next", "dev", "-H", "0.0.0.0", "-p", "3000"]
