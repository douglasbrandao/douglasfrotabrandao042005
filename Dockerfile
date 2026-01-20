FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --silent

COPY . .

RUN npm run build -- --configuration=production

FROM nginx:stable-alpine AS runtime

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist/pet-manager/browser/. /usr/share/nginx/html/

COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD wget -qO- --spider http://localhost:80/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
