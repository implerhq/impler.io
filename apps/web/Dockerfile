FROM node:20.13.1-slim

WORKDIR /usr/src/app

RUN npm i -g npm@9.5.1 pnpm@8.9.0

COPY .npmrc .
COPY package.json .
COPY pnpm-lock.yaml .

COPY tsconfig.json .
COPY tsconfig.base.json .

COPY nx.json .
COPY pnpm-workspace.yaml .

COPY .eslintrc.js .
COPY .prettierrc .
COPY .prettierignore .

COPY apps/web ./apps/web
COPY apps/web/.example.env ./apps/web/.env
COPY libs/shared ./libs/shared
COPY packages/react ./packages/react

ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm i
RUN pnpm build

CMD ["pnpm", "start:static:web"]