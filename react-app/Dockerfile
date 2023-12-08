FROM node:21.2.0-alpine3.18 AS build-stage
WORKDIR /app
COPY . /app/
RUN ["npm", "install"]
RUN ["npm", "run", "build"]

FROM nginx:stable-alpine3.17-slim
COPY --from=build-stage /app/build /usr/share/nginx/html
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]


