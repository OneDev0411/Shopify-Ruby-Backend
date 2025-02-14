FROM ruby:3.1-alpine3.18

RUN apk update && apk add nodejs npm git build-base sqlite-dev postgresql-dev postgresql-client gcompat bash openssl-dev

ARG SHOPIFY_API_KEY
ENV SHOPIFY_API_KEY=$SHOPIFY_API_KEY

ARG VITE_REACT_APP_ERROR_IMG_URL
ENV VITE_REACT_APP_ERROR_IMG_URL=$VITE_REACT_APP_ERROR_IMG_URL

ARG VITE_REACT_APP_ERROR_TITLE
ENV VITE_REACT_APP_ERROR_TITLE=$VITE_REACT_APP_ERROR_TITLE

ARG VITE_REACT_APP_ERROR_CONTENT
ENV VITE_REACT_APP_ERROR_CONTENT=$VITE_REACT_APP_ERROR_CONTENT

ARG VITE_SHOPIFY_ICU_EXTENSION_APP_ID
ENV VITE_SHOPIFY_ICU_EXTENSION_APP_ID=$VITE_SHOPIFY_ICU_EXTENSION_APP_ID

ARG VITE_ENABLE_THEME_APP_EXTENSION
ENV VITE_ENABLE_THEME_APP_EXTENSION=$VITE_ENABLE_THEME_APP_EXTENSION

ARG VITE_REACT_APP_INTERCOM_APP_ID
ENV VITE_REACT_APP_INTERCOM_APP_ID=$VITE_REACT_APP_INTERCOM_APP_ID

ARG SECRET_KEY_BASE
ENV SECRET_KEY_BASE=$SECRET_KEY_BASE

ARG RAILS_MASTER_KEY
ENV RAILS_MASTER_KEY=$RAILS_MASTER_KEY

ARG VITE_REACT_APP_MODAL_CONTENT
ENV VITE_REACT_APP_MODAL_CONTENT=$VITE_REACT_APP_MODAL_CONTENT

ARG VITE_FIREBASE_API_KEY
ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY

ARG VITE_FIREBASE_AUTH_DOMAIN
ENV VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN

ARG VITE_FIREBASE_PROJECT_ID
ENV VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID

ARG VITE_FIREBASE_STORAGE_BUCKET
ENV VITE_FIREBASE_STORAGE_BUCKET=$VITE_FIREBASE_STORAGE_BUCKET

ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ENV VITE_FIREBASE_MESSAGING_SENDER_ID=$VITE_FIREBASE_MESSAGING_SENDER_ID

ARG VITE_FIREBASE_APP_ID
ENV VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID

ARG VITE_FIREBASE_MEASUREMENT_ID
ENV VITE_FIREBASE_MEASUREMENT_ID=$VITE_FIREBASE_MEASUREMENT_ID

WORKDIR /app
COPY web .

RUN cd frontend && npm install
RUN bundle install

RUN cd frontend && npm run build
RUN rake build:all

COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh

ENTRYPOINT ["entrypoint.sh"]
