FROM node:22-alpine

WORKDIR /app

COPY package* .
COPY ./src/db/prisma/ ./src/db/prisma/

RUN npm install
RUN npm run db:generate

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm" , "run", "start"]
