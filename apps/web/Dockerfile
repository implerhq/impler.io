FROM node:18.13.0-slim

WORKDIR /usr/src/app

RUN npm install -g pnpm@7.9.4

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

RUN pnpm install
RUN pnpm build

CMD [ "pnpm", "start:static:web" ]
