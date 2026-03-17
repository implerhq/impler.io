FROM node:20.13.1-slim

RUN npm install -g pnpm@8.9.0 --loglevel notice

WORKDIR /usr/src/app

# Copy manifests before source to maximize layer cache reuse
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY apps/widget/package.json ./apps/widget/
COPY libs/shared/package.json ./libs/shared/
COPY packages/client/package.json ./packages/client/

RUN pnpm install --frozen-lockfile --ignore-scripts

# Copy source and pre-built artifacts
COPY tsconfig.json tsconfig.base.json nx.json ./
COPY apps/widget ./apps/widget
COPY apps/widget/.example.env ./apps/widget/.env
COPY libs/shared ./libs/shared
COPY packages/client ./packages/client

RUN pnpm build:widget

# Use built-in non-root node user (uid 1000)
USER node

CMD ["pnpm", "start:static:widget"]
