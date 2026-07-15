FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ARG VITE_AUTH_API_URL
ARG VITE_LOANS_API_URL
ARG VITE_INTEGRATION_API_URL

ENV VITE_AUTH_API_URL=$VITE_AUTH_API_URL
ENV VITE_LOANS_API_URL=$VITE_LOANS_API_URL
ENV VITE_INTEGRATION_API_URL=$VITE_INTEGRATION_API_URL

RUN npm run build

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]