FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
COPY apps/slack-bot/package.json apps/slack-bot/package.json
RUN npm install --workspace @stardusts/slack-bot --include-workspace-root

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm --workspace @stardusts/slack-bot run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/slack-bot/dist ./apps/slack-bot/dist
COPY --from=build /app/apps/slack-bot/package.json ./apps/slack-bot/package.json
CMD ["node", "apps/slack-bot/dist/index.js"]
