FROM node:4.5-slim

RUN groupadd user && useradd --create-home --home-dir /home/user -g user user

ENV REACT_SOURCE /usr/local/src/plate
ENV TZ=Asia/Taipei
WORKDIR $REACT_SOURCE

# COPY config.js /config.js 
# COPY gcskeyfile.json /gcskeyfile.json
COPY . $ENV

RUN sed -i 's;http://archive.debian.org/debian/;http://deb.debian.org/debian/;' /etc/apt/sources.list \
    && buildDeps=' \
    gcc \
    make \
    python \
    ' \
    && set -x \
    && apt-get update \
    && apt-get install -y --no-install-recommends curl ca-certificates $buildDeps \
    && apt-get install -y git \
    && apt-get install -y graphicsmagick \
    && apt-get install -y imagemagick \ 
    && apt-get install -y node-gyp \
    && rm -rf /var/lib/apt/lists/* \
    && npm install \
    && npm install pm2@2.9.3 -g

# RUN buildDeps=' \
#         gcc \
#         make \
#         python \
#     ' \
#   && set -x \
#     && apt-get update && apt-get install -y $buildDeps --no-install-recommends && rm -rf /var/lib/apt/lists/* \
# #   && git clone https://github.com/mirror-media/plate.git plate \
#     # && cd plate \ 
#     # && git pull \
#     # && cp /config.js /gcskeyfile.json . \
#     # && cp -rf . .. \
#     # && cd .. \
#     # && rm -rf plate \ 
#     && npm install \
#     && npm install pm2 -g

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

EXPOSE 3000
CMD ["pm2", "start", "keystone.js", "--no-daemon"]
