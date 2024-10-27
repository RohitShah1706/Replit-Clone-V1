# Stage 1: Builder
FROM node:20.18.0 as builder

WORKDIR /code

COPY tsconfig.json ./
COPY package*.json ./

RUN npm install

COPY src ./src

RUN npm run build

# Stage 2: Runner
FROM node:20.18.0 as runner

WORKDIR /code

# Create user `abc` with uid=1001
RUN useradd -m -d /home/abc -s /bin/bash -u 1001 abc \
    && mkdir /home/abc/workspace \
    && chown -R abc:abc /home/abc/workspace

# Install production dependencies   
COPY package*.json ./
RUN npm install --omit=dev

# Copy the build files from the builder stage
COPY --from=builder /code/dist ./dist

# Expose the desired port
EXPOSE 1234

# Use root to run the app
CMD ["npm", "run", "start"]
