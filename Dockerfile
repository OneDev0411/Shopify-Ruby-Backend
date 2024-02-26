FROM ruby:3.1-alpine

RUN apk update && apk add nodejs npm git build-base sqlite-dev postgresql-dev postgresql-client gcompat bash openssl-dev

ARG SHOPIFY_API_KEY
ENV SHOPIFY_API_KEY=$SHOPIFY_API_KEY

ARG SECRET_KEY_BASE
ENV SECRET_KEY_BASE=$SECRET_KEY_BASE

ARG RAILS_MASTER_KEY
ENV RAILS_MASTER_KEY=$RAILS_MASTER_KEY

ARG VITE_REACT_APP_MODAL_CONTENT
ENV VITE_REACT_APP_MODAL_CONTENT=$VITE_REACT_APP_MODAL_CONTENT

WORKDIR /app
COPY web .

RUN cd frontend && npm install
RUN bundle install

RUN cd frontend && npm run build
RUN rake build:all

COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh

ENTRYPOINT ["entrypoint.sh"]
