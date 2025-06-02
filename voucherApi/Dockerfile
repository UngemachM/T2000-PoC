FROM node:18-alpine

WORKDIR /app

# Package files kopieren
COPY package*.json ./

# Dependencies installieren
RUN npm ci --only=production && npm cache clean --force

# App-Code kopieren
COPY . .

# Non-root user erstellen
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Ownership ändern
RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/vouchers || exit 1

CMD ["npm", "start"]
