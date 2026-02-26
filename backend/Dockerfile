FROM node:20

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm ci --silent

# Copy source
COPY . .

# Generate Prisma client (if Prisma is present)
RUN npx prisma generate --schema=prisma/schema.prisma || true

EXPOSE 3000

# Dev entrypoint; uses the project's dev script
CMD ["npm", "run", "dev"]

