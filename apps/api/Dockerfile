FROM node:20.13.1-bullseye-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    locales \
    locales-all \
    libcap-dev \
  && rm -rf /var/lib/apt/lists/*

# Install all global tools in a single layer
RUN npm install -g pnpm@8.9.0 pm2 --loglevel notice

WORKDIR /usr/src/app

# Copy manifests before source to maximize layer cache reuse
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY apps/api/package.json ./apps/api/
COPY libs/dal/package.json ./libs/dal/
COPY libs/shared/package.json ./libs/shared/
COPY libs/services/package.json ./libs/services/
COPY packages/client/package.json ./packages/client/

RUN pnpm install --frozen-lockfile --ignore-scripts

# Copy source and pre-built artifacts
COPY tsconfig.json tsconfig.base.json nx.json ./
COPY apps/api ./apps/api
COPY libs/dal ./libs/dal
COPY libs/shared ./libs/shared
COPY libs/services ./libs/services
COPY packages/client ./packages/client

RUN pnpm build:api

RUN cp apps/api/src/config/default.cf /usr/local/etc/isolate

WORKDIR /usr/src/app/apps/api
RUN cp src/.example.env dist/src/.env \
  && cp src/.env.test dist/src/.env.test \
  && cp src/.env.development dist/src/.env.development \
  && cp src/.env.production dist/src/.env.production

# pm2 needs a writable home directory; /tmp is always writable by all users
ENV PM2_HOME=/tmp/pm2

# Use built-in non-root node user (uid 1000)
USER node

CMD ["pm2-runtime", "/usr/src/app/apps/api/dist/main.js"]
