FROM node:20-alpine AS base

FROM base as deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json ./
RUN npm install

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_RUNNER_URL
ARG NEXT_PUBLIC_API_URL
RUN touch .env.production
RUN echo "NEXT_PUBLIC_RUNNER_URL=${NEXT_PUBLIC_RUNNER_URL}" >> .env.production
RUN echo "NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}" >> .env.production
RUN cat .env.production
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

#creates a system group named nodejs 
RUN addgroup --system --gid 1001 nodejs

#creates a system group named nextjs 
RUN adduser --system --uid 1001 nextjs

#copy the file from to public folder 
COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
