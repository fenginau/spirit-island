FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# This app reads GEMINI_API_KEY at build time via Vite loadEnv.
ARG GEMINI_API_KEY=""
RUN if [ -n "$GEMINI_API_KEY" ]; then printf "GEMINI_API_KEY=%s\n" "$GEMINI_API_KEY" > .env.production; fi

RUN npm run build

FROM nginx:1.27-alpine AS runner

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
