FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV VITE_API_BASE_URL=http://localhost:8000
EXPOSE 5173

CMD ["npx", "vite", "--host", "0.0.0.0", "--port", "5173"]
