FROM   node:lts-alpine as build

RUN    mkdir /app
RUN    chown node:node /app

USER   node
WORKDIR /app
COPY   --chown=node:node . ./

RUN    npm config set registry http://registry.npmjs.org/;
RUN    npm install;
RUN    npm run build


# production environment
FROM nginx:1.16.0-alpine

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
