FROM node:alpine 

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
COPY shared-schemas/ /app/shared-schemas/

RUN npx prisma generate --schema=./prisma/prod/schema.prisma

# (Optional) Run migration in dev — can be skipped in production
# UNCOMMENT if you want to auto-apply migrations (for dev or init setup)
#RUN npx prisma migrate dev --name init  --skip-seed --skip-generate

CMD ["npm","start"]
