FROM alpine:3.4 as base

RUN apk update

FROM base as withvim
RUN apk add vim

FROM base as withcurl
RUN apk add curl