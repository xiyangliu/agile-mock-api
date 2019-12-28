FROM node:12.14-alpine
RUN mkdir -p /app
WORKDIR /app
COPY . .
RUN yarn install
EXPOSE 5000
CMD ["npm", "run", "start"]