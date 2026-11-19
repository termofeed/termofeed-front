# Etapa 1: Compilação do front-end
FROM node:20-alpine AS builder

WORKDIR /app

# Copia dependências primeiro para aproveitar cache do Docker
COPY package*.json ./
RUN npm ci

# Copia código-fonte e compila
COPY . .
RUN npm run build

# Etapa 2: Servidor web com Caddy oficial
FROM caddy:2-alpine

# Copia arquivos estáticos compilados
COPY --from=builder /app/dist /usr/share/caddy

# Copia configuração do Caddy
COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 80 443

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
