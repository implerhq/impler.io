FROM node:20.13.1-slim

RUN npm install -g pnpm@8.9.0 --loglevel notice

WORKDIR /usr/src/app

# Copy manifests before source to maximize layer cache reuse
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY libs/embed/package.json ./libs/embed/

RUN pnpm install --frozen-lockfile

# Copy source files
COPY tsconfig.json tsconfig.base.json nx.json ./
COPY libs/embed ./libs/embed

# Use built-in non-root node user (uid 1000)
USER node

CMD ["pnpm", "start:docker:embed"]
