FROM node:11-alpine as build

RUN apk add --update \
  python \
  python-dev \
  py-pip \
  build-base

WORKDIR /usr/src
COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

FROM keymetrics/pm2:latest-alpine
WORKDIR /usr/app
ENV NODE_ENV="production"

COPY --from=build /usr/src/build .

EXPOSE 4000

CMD [ "pm2-runtime", "start", "./index.js" ]
