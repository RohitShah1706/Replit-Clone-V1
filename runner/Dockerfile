FROM node:20.18.0 as builder

WORKDIR /code

COPY tsconfig.json ./
COPY package*.json ./

RUN npm install

COPY src ./src

RUN npm run build

FROM node:20.18.0 as runner

WORKDIR /code

COPY package*.json ./

RUN npm install --only=production

COPY --from=builder /code/dist ./dist

EXPOSE 1234

CMD [ "npm", "run", "start" ]