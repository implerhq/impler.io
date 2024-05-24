FROM node:20.13.1-slim

WORKDIR /usr/src/app

RUN npm i -g \
  npm@10.5.2 \
  pnpm@8.9.0

COPY .npmrc .
COPY package.json .

COPY apps/web ./apps/web
COPY apps/web/.example.env ./apps/web/.env
COPY libs/shared ./libs/shared
COPY packages/react ./packages/react

COPY tsconfig.json .
COPY tsconfig.base.json .

COPY .eslintrc.js .
COPY .prettierrc .
COPY .prettierignore .
COPY nx.json .
COPY pnpm-workspace.yaml .
COPY pnpm-lock.yaml .

ENV NEXT_TELEMETRY_DISABLED 1

RUN pnpm i

CMD [ "pnpm", "start:static:web" ]
