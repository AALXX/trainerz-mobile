FROM node:21.4.0
WORKDIR /backend
COPY package.json .
RUN npm install
COPY . .
EXPOSE 7070
CMD ['npm run server']