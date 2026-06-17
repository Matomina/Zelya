FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

FROM base AS dev
RUN npm ci
COPY . .
RUN npx prisma generate
CMD ["npm", "run", "start:dev"]

FROM base AS build
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma
COPY package*.json ./
ENV NODE_ENV=production
CMD ["node", "dist/main"]
