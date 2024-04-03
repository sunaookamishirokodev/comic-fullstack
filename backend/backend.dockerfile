FROM oven/bun:1

WORKDIR /app

COPY package*.json ./

RUN bun install

COPY prisma ./prisma

RUN bun x prisma generate

COPY . .

EXPOSE 5555

CMD ["bun", "src/index.ts"]
