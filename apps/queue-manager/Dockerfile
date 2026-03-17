FROM node:20.13.1-slim

# Install all global tools in a single layer
RUN npm install -g pnpm@8.9.0 pm2 --loglevel notice

WORKDIR /usr/src/app

# Copy manifests before source to maximize layer cache reuse
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY apps/queue-manager/package.json ./apps/queue-manager/
COPY libs/dal/package.json ./libs/dal/
COPY libs/shared/package.json ./libs/shared/
COPY libs/services/package.json ./libs/services/
COPY packages/client/package.json ./packages/client/

RUN pnpm install --frozen-lockfile --ignore-scripts

# Copy source and pre-built artifacts
COPY tsconfig.json tsconfig.base.json nx.json ./
COPY apps/queue-manager ./apps/queue-manager
COPY libs/dal ./libs/dal
COPY libs/shared ./libs/shared
COPY libs/services ./libs/services
COPY packages/client ./packages/client

RUN pnpm build:queue-manager

WORKDIR /usr/src/app/apps/queue-manager
RUN cp src/.example.env dist/.env \
  && cp src/.env.test dist/.env.test \
  && cp src/.env.development dist/.env.development \
  && cp src/.env.production dist/.env.production

# pm2 needs a writable home directory; /tmp is always writable by all users
ENV PM2_HOME=/tmp/pm2

EXPOSE 3000

# Use built-in non-root node user (uid 1000)
USER node

CMD ["pm2-runtime", "/usr/src/app/apps/queue-manager/dist/index.js"]
