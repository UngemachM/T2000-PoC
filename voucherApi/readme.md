# Gutschein-Tool API

Ein Proof of Concept für ein Gutschein-Validierungstool mit Docker-Unterstützung.

## Schnellstart mit Docker

### Voraussetzungen
- Docker und Docker Compose installiert
- VS Code mit Dev Containers Extension (optional)

### Entwicklung starten

```bash
# Repository klonen
git clone <your-repo>
cd voucher-api

# Mit Docker Compose starten
docker-compose up -d

# Logs anzeigen
docker-compose logs -f voucher-api
```

### VS Code Dev Container

1. Öffne das Projekt in VS Code
2. Klicke auf "Reopen in Container" wenn prompted
3. Oder: Cmd/Ctrl+Shift+P → "Dev Containers: Reopen in Container"

### API Testen

```bash
# Gesundheitscheck
curl http://localhost:3000/api/vouchers

# Gutschein validieren
curl -X POST http://localhost:3000/api/validate-voucher \
  -H "Content-Type: application/json" \
  -d '{
    "voucherCode": "SUMMER20",
    "cart": {
      "products": [
        {"id": "1", "name": "T-Shirt", "price": 25, "quantity": 2, "category": "clothing"}
      ]
    },
    "customer": {
      "age": 25,
      "isNewCustomer": false
    }
  }'
```

### Nützliche Befehle

```bash
# Container neu bauen
docker-compose build

# Container stoppen
docker-compose down

# Tests ausführen
docker-compose exec voucher-api npm test

# Shell im Container
docker-compose exec voucher-api sh
```

## API Endpoints

- `GET /api/vouchers` - Alle verfügbaren Gutscheine auflisten
- `POST /api/validate-voucher` - Gutschein gegen Warenkorb validieren

## Architektur

- **Node.js/Express** - REST API
- **Docker** - Containerisierung
- **Redis** - Optional für Caching/Sessions
- **Jest** - Testing Framework