FROM node:10-alpine AS build

RUN wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub \
 && wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.31-r0/glibc-2.31-r0.apk \
 && apk add glibc-2.31-r0.apk \
 && wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.31-r0/glibc-bin-2.31-r0.apk \
 && wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.31-r0/glibc-i18n-2.31-r0.apk \
 && apk add glibc-bin-2.31-r0.apk glibc-i18n-2.31-r0.apk \
 && /usr/glibc-compat/bin/localedef -i en_US -f UTF-8 en_US.UTF-8 \
 && echo 'done'

WORKDIR /opt/app

COPY package*.json ./

RUN npm install --only=production \
 && cp -R node_modules ../prod_node_modules \
 && npm install \
 && echo 'done'

COPY jest.config.js tsconfig.json ./
COPY api/ ./api/
COPY configs/ ./configs/
COPY src/ ./src/

RUN mkdir generated \
 && npm run genproto \
 && npm run build \
 && npm run test \
 && echo 'done'

FROM node:10-alpine AS run

WORKDIR /opt/app

COPY --from=build /opt/prod_node_modules ./node_modules
COPY --from=build /opt/app/build ./build
COPY --from=build /opt/app/configs ./configs
COPY --from=build /opt/app/generated ./generated
COPY --from=build /opt/app/package.json ./

ENTRYPOINT ["npm", "run", "start"]
