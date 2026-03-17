FROM node:20.13.1-slim

RUN npm install -g pnpm@8.9.0 --loglevel notice

WORKDIR /usr/src/app

# Copy manifests before source to maximize layer cache reuse
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY apps/web/package.json ./apps/web/
COPY libs/shared/package.json ./libs/shared/
COPY packages/client/package.json ./packages/client/
COPY packages/react/package.json ./packages/react/

RUN pnpm install --frozen-lockfile --ignore-scripts

# Copy source and pre-built artifacts
COPY tsconfig.json tsconfig.base.json nx.json ./
COPY apps/web ./apps/web
COPY apps/web/.example.env ./apps/web/.env
COPY libs/shared ./libs/shared
COPY packages/client ./packages/client
COPY packages/react ./packages/react

# Disable Next.js telemetry at build and runtime
ENV NEXT_TELEMETRY_DISABLED=1

# Uncomment to build inside Docker (currently built outside and copied in)
# RUN pnpm build

# Use built-in non-root node user (uid 1000)
USER node

CMD ["pnpm", "start:static:web"]
