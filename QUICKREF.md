# ⚡ Cretip Quick Reference Card

## One-Liner Commands

```bash
# Setup (one-time)
./QUICKSTART.sh  # macOS/Linux
QUICKSTART.bat   # Windows

# Start all services
npm run dev

# Start individually
npm run dev --prefix backend   # Terminal 1
npm run dev --prefix frontend  # Terminal 2
```

## URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:3001 |
| API Health | http://localhost:3001/api/health |

## API Endpoints

```bash
# Get creator
curl http://localhost:3001/api/creators/alice

# Send tip
curl -X POST http://localhost:3001/api/tips \
  -H "Content-Type: application/json" \
  -d '{"tx_hash":"test123","amount":5,"creator_id":"creator_1"}'

# Get tips
curl http://localhost:3001/api/tips/creator_1
```

## Creator IDs

| Username | ID |
|----------|-----|
| alice | creator_1 |
| bob | creator_2 |
| charlie | creator_3 |

## File Locations

| Layer | Main File |
|-------|-----------|
| Backend | `backend/src/server.js` |
| Frontend | `frontend/app/page.js` |
| Styles | `frontend/app/globals.css` |
| Contract | `contract/src/lib.rs` |

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port in use | `PORT=3002 npm run dev` |
| Missing modules | `npm install` |
| Not starting | Check ports, restart |
| Styling broken | Hard refresh: Ctrl+Shift+R |
| API error | Verify backend running |

## Development

| Task | Command |
|------|---------|
| Lint | `npm run lint` |
| Build | `npm run build` |
| Test | `npm test` |
| Clean | `npm run clean` |

## Documentation

| Need | File |
|------|------|
| Help | [INDEX.md](./INDEX.md) |
| Setup | [SETUP.md](./SETUP.md) |
| API | [API.md](./API.md) |
| Architecture | [ARCHITECTURE.md](./ARCHITECTURE.md) |
| Troubleshooting | [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) |

## Key Files Structure

```
cretip-app/
├── backend/src/server.js      # API server (200 lines)
├── frontend/app/page.js       # Homepage (100 lines)
├── frontend/app/[username]/   # Creator profile
├── frontend/components/       # React components
├── contract/src/lib.rs        # Smart contract
└── README.md                  # Documentation
```

## Colors

| Name | Value |
|------|-------|
| Dark BG | `#0F172A` |
| Cyan | `#00F0FF` |
| Purple | `#9D4EDD` |
| Emerald | `#10B981` |

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created (tip logged) |
| 400 | Bad request |
| 404 | Not found |

## Environment Variables

**Frontend:**
```env
NEXT_PUBLIC_API_BASE=http://localhost:3001/api
```

**Backend:**
```env
PORT=3001
NODE_ENV=development
```

## Testing Workflow

1. Browser: http://localhost:3000
2. Click creator → Navigate
3. Connect wallet → Mock connection
4. Select amount → $2, $5, $10
5. Send tip → POST to API
6. See in feed → Real-time update

## Hot Reload

| System | Changes Reload |
|--------|---|
| Backend | Auto (npm run dev) |
| Frontend | Auto (npm run dev) |
| Contract | Manual (cargo build) |

## Git

```bash
# Branch
git checkout -b feature/name

# Commit
git add .
git commit -m "feat: description"

# Push
git push origin feature/name

# PR
gh pr create
```

## npm Scripts

**Backend:**
```bash
npm run dev   # Start with reload
npm run lint  # Check code
npm start     # Production
```

**Frontend:**
```bash
npm run dev   # Start dev server
npm run build # Build for prod
npm run lint  # Check code
npm start     # Production
```

**Monorepo:**
```bash
npm run dev       # Both servers
npm run build     # Build both
npm run lint      # Lint both
npm run setup     # Initial setup
```

## Component Structure

**Page:**
```javascript
'use client';
import { useState, useEffect } from 'react';

export default function Page() {
  return <div>Content</div>;
}
```

**Component:**
```javascript
const Component = ({ prop }) => {
  return <div>Content</div>;
};
export default Component;
```

## Common Errors

| Error | Fix |
|-------|-----|
| Cannot find module | `npm install` |
| Port in use | `PORT=3002 npm run dev` |
| CORS error | Ensure backend running |
| 404 creator | Check username spelling |
| Blank page | Hard refresh browser |

## Performance Targets

- Homepage load: <2s
- Creator page: <1s
- Tip send: <500ms
- API response: <100ms

## Node.js + npm Versions

- Node.js: 18+
- npm: 9+

Check:
```bash
node --version
npm --version
```

## Next Features Roadmap

- [ ] Real Stellar wallet
- [ ] Testnet integration
- [ ] Creator registration
- [ ] Database persistence
- [ ] Authentication
- [ ] Notifications

---

**Bookmarks:**
- Setup: [SETUP.md](./SETUP.md)
- API: [API.md](./API.md)
- Help: [INDEX.md](./INDEX.md)

**Print this page for offline reference! 📄**
