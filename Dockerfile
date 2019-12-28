FROM node:11-alpine
RUN mkdir -p /app
WORKDIR /app
COPY . .
RUN yarn install
EXPOSE 3000
CMD ["npm", "run", "start"]