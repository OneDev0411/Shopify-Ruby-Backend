ARG SHOPIFY_API_KEY
ENV SHOPIFY_API_KEY=$SHOPIFY_API_KEY
WORKDIR /app
COPY web .

# for frontend code
FROM node:18-alpine

EXPOSE 8081
RUN npm install
RUN cd frontend && npm install && npm run build
CMD ["npm", "run", "serve"]

# for backend code
FROM ruby:3.1-alpine

RUN apk update && apk add nodejs npm git build-base sqlite-dev postgresql-dev postgresql-client gcompat bash openssl-dev

RUN bundle install
RUN rake build:all

COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh

ENTRYPOINT ["entrypoint.sh"]
