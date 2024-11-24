FROM node:20-alpine as base

FROM base as deps
WORKDIR /app
COPY package*.json ./
RUN npm install


FROM base as builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./
COPY prisma ./prisma
RUN npm run generate
COPY . .
RUN npm run build


FROM base as runner
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
EXPOSE 5000
CMD [ "npm", "start" ]