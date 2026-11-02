# Build estático (Astro) servido por nginx com gzip e cache — deploy direto pelo GitHub (ex.: Coolify).
FROM node:22-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY . .
# Variáveis do astro:env podem ser passadas como build args (todas têm padrão de produção)
ARG SITE_URL
ARG HUBSPOT_PORTAL_ID
ARG HUBSPOT_REGION
ARG TRACKING_LOADER_URL
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
