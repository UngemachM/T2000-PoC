FROM node:18-alpine

# Wichtige Tools installieren
RUN apk add --no-cache wget curl dumb-init

WORKDIR /app

# Package files kopieren
COPY package*.json ./

# Dependencies installieren (alle für Flexibilität)
RUN npm install && npm cache clean --force


# App-Code kopieren
COPY . .

# Non-root user erstellen
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# dumb-init für proper signal handling
ENTRYPOINT ["dumb-init", "--"]

# Command basiert auf NODE_ENV
CMD ["npm", "start"]

