FROM node:24
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package*.json /usr/src/app/
RUN npm ci
COPY . /usr/src/app
RUN npm run build
ENV PORT=3000
EXPOSE 3000
CMD ["npm", "start"]
