FROM node:22-bookworm-slim

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 zip ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

RUN mkdir -p data/laws \
  && if [ -f data/laws.tar.gz ]; then tar -xzf data/laws.tar.gz -C data && rm -f data/laws.tar.gz; fi \
  && python3 scripts/ingest_gesetze.py --workers 8

ENV NODE_ENV=production
ENV PORT=8000
ENV HOSTNAME=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=8s --start-period=40s --retries=5 \
  CMD node -e "fetch('http://127.0.0.1:8000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["npx", "next", "start", "-H", "0.0.0.0", "-p", "8000"]
