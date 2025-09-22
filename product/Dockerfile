FROM node:alpine 

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
COPY shared-schemas/ /app/shared-schemas/

CMD ["npm","start"]
