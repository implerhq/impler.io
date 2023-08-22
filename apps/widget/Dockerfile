FROM node:18.13.0-slim as builder

WORKDIR /usr/src/app

RUN npm install -g pnpm@7.9.4 --loglevel notice

COPY .npmrc .
COPY package.json .

COPY apps/widget ./apps/widget
COPY apps/widget/.env ./apps/widget/.env
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

# ENTRYPOINT [ "pnpm", "start:static:widget" ]

FROM nginx:alpine as production
ENV NODE_ENV production

COPY --from=builder /usr/src/app/apps/widget/build /usr/share/nginx/html

COPY --from=builder /usr/src/app/apps/widget/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]