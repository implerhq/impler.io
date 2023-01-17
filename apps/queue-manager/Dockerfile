FROM node:18.13.0-slim

WORKDIR /usr/src/app

RUN npm install -g pnpm@7.9.4 --loglevel notice
RUN npm i pm2 -g

COPY package.json .
COPY .npmrc .

COPY apps/queue-manager ./apps/queue-manager
COPY libs/dal ./libs/dal
COPY libs/shared ./libs/shared

COPY tsconfig.json .
COPY tsconfig.base.json .

COPY nx.json .
COPY pnpm-workspace.yaml .
COPY pnpm-lock.yaml .

RUN pnpm i

WORKDIR /usr/src/app/apps/queue-manager
RUN cp src/.example.env dist/.env
RUN cp src/.env.test dist/.env.test
RUN cp src/.env.development dist/.env.development
RUN cp src/.env.production dist/.env.production

EXPOSE 3000

CMD [ "pm2-runtime", "/usr/src/app/apps/queue-manager/dist/index.js" ]