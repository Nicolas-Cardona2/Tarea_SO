FROM node:18-alpine
RUN corepack enable && corepack prepare pnpm@8 --activate
WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install
COPY . .
EXPOSE 3000
CMD ["pnpm", "start"]
