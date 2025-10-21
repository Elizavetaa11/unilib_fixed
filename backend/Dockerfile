# Было:
# FROM node:20-alpine

# Стало:
FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY . .

EXPOSE 5000

CMD ["node", "src/server.js"]
