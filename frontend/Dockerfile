FROM node:latest

WORKDIR /frontend

COPY package*.json ./

RUN npm install -g http-server

COPY . .

EXPOSE 3000

CMD ["http-server", ".", "--host", "0.0.0.0", "--port", "3000"]
