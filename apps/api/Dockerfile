FROM node:18.16.1-bullseye-slim

COPY apps/api/src/config/default.cf /usr/local/etc/isolate

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    locales \
    locales-all \
    libcap-dev \
 && rm -rf /var/lib/apt/lists/*

RUN npm i -g \
  npm@10.5.2 \
  pnpm@8.9.0

WORKDIR /usr/src/app

RUN npm install -g pnpm@8.9.0 --loglevel notice
RUN npm i pm2 -g

COPY package.json .
COPY .npmrc .

COPY apps/api ./apps/api
COPY libs/dal ./libs/dal
COPY libs/shared ./libs/shared

COPY tsconfig.json .
COPY tsconfig.base.json .

COPY nx.json .
COPY pnpm-workspace.yaml .
COPY pnpm-lock.yaml .

RUN pnpm i

WORKDIR /usr/src/app/apps/api
RUN cp src/.example.env dist/src/.env
RUN cp src/.env.test dist/src/.env.test
RUN cp src/.env.development dist/src/.env.development
RUN cp src/.env.production dist/src/.env.production

CMD [ "pm2-runtime", "/usr/src/app/apps/api/dist/main.js" ]