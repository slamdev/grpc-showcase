FROM adoptopenjdk/openjdk13:jdk-13.0.2_8-alpine-slim AS build

RUN apk add -u wget \
 && wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub \
 && wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.31-r0/glibc-2.31-r0.apk \
 && apk add glibc-2.31-r0.apk \
 && wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.31-r0/glibc-bin-2.31-r0.apk \
 && wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.31-r0/glibc-i18n-2.31-r0.apk \
 && apk add glibc-bin-2.31-r0.apk glibc-i18n-2.31-r0.apk \
 && /usr/glibc-compat/bin/localedef -i en_US -f UTF-8 en_US.UTF-8 \
 && echo 'done'

WORKDIR /opt/app

COPY gradle/ ./gradle/
COPY build.gradle gradlew ./

RUN ./gradlew resolveDependencies \
 && echo 'done'

COPY src/ ./src/

RUN ./gradlew build \
 && echo 'done'

FROM adoptopenjdk/openjdk13:jre-13.0.2_8-alpine AS run

WORKDIR /opt/app

COPY --from=build /opt/app/build/libs/app.jar ./

ENTRYPOINT ["java", "-jar", "app.jar"]
