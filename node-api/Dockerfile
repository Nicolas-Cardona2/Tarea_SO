FROM node:20-alpine

WORKDIR /usr/src/app

RUN npm init -y

RUN npm install next@14.2.3 react@18 react-dom@18 lucide-react chart.js react-chartjs-2 @prisma/client@6.9.0

RUN npm install -D prisma@6.9.0

COPY . .

RUN npx prisma generate

RUN npx next build

EXPOSE 3000

CMD ["npx", "next", "start"]
