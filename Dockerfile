# Etapa de Build
FROM node:alpine AS build

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:alpine AS production

WORKDIR /usr/app

COPY --from=build /usr/app/package*.json ./
COPY --from=build /usr/app/node_modules ./node_modules
COPY --from=build /usr/app/dist ./dist
COPY --from=build /usr/app/init.sql ./dist

CMD ["npm", "run", "start"]
