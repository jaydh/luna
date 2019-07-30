FROM node:12.7
WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn 
COPY . .
EXPOSE 5000
CMD [ "node", "index.js" ]
