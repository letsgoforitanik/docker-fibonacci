FROM node:21.2.0-alpine3.18
WORKDIR /app
COPY . /app/
RUN ["npm", "install"]
RUN ["npm", "run", "build"]
RUN ["rm", "-r", "src"]
CMD ["npm", "run", "prod"]