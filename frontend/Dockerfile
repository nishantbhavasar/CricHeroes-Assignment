FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production && npm cache clean --force
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
