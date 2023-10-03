
FROM oven/bun as builder
WORKDIR /my-project
COPY . .
COPY package.json bun.lockb ./
RUN bun install --network-timeout 100000
RUN bun run build

FROM oven/bun as runner
WORKDIR /my-project
ENV NODE_ENV production
COPY --from=builder /my-project/next.config.js ./
COPY --from=builder /my-project/public ./public
COPY --from=builder /my-project/.next ./.next
COPY --from=builder /my-project/node_modules ./node_modules
COPY --from=builder /my-project/package.json ./package.json

EXPOSE 3000
CMD ["bun", "start"]
