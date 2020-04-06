FROM   node:lts-alpine

RUN    mkdir /app
RUN    chown node:node /app

USER   node
WORKDIR /app
COPY   --chown node:node . ./

RUN    npm config set registry http://registry.npmjs.org/;

RUN    npm install;

EXPOSE 3000

CMD    node server.js;