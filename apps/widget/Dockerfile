FROM node:20.13.1-slim

WORKDIR /usr/src/app

RUN npm install -g pnpm@8.9.0 --loglevel notice

COPY .npmrc .
COPY package.json .

COPY apps/widget ./apps/widget
COPY apps/widget/.example.env ./apps/widget/.env
COPY packages/client ./packages/client
COPY libs/shared ./libs/shared

COPY tsconfig.json .
COPY tsconfig.base.json .

COPY .eslintrc.js .
COPY .prettierrc .
COPY .prettierignore .
COPY nx.json .
COPY pnpm-workspace.yaml .
COPY pnpm-lock.yaml .

RUN pnpm install
RUN pnpm build

CMD [ "pnpm", "start:static:widget" ]
