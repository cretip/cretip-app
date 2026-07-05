# 🔧 Troubleshooting Guide

Quick solutions to common issues when running Cretip.

## Port Conflicts

### Problem: "Port 3000 is already in use"

**Solution 1: Find what's using port 3000**
```bash
# macOS/Linux
lsof -i :3000

# Windows
netstat -ano | findstr :3000
```

**Solution 2: Kill the process**
```bash
# macOS/Linux
kill -9 <PID>

# Windows
taskkill /PID <PID> /F
```

**Solution 3: Use different port**
```bash
# Frontend
PORT=3002 npm run dev

# Update frontend config to use new backend port if needed
# In frontend/.env.local:
NEXT_PUBLIC_API_BASE=http://localhost:3001/api
```

### Problem: "Port 3001 is already in use"

**Solution: Change backend port**
```bash
cd backend
PORT=3002 npm run dev
```

Then update frontend `.env.local`:
```env
NEXT_PUBLIC_API_BASE=http://localhost:3002/api
```

---

## Backend Issues

### Problem: "Cannot find module 'express'"

**Solution:**
```bash
cd backend
npm install

# Or clean install:
rm -rf node_modules package-lock.json
npm install
```

### Problem: "Backend running but frontend shows 'Failed to fetch'"

**Possible causes:**
1. Backend not running
2. Wrong port in frontend config
3. CORS misconfiguration

**Solutions:**
```bash
# 1. Verify backend is running
curl http://localhost:3001/api/health

# 2. Check frontend config in .env.local
echo $NEXT_PUBLIC_API_BASE

# 3. If CORS issues, verify backend has:
import cors from 'cors';
app.use(cors());
```

### Problem: "API returns 404 for valid endpoints"

**Solution: Check exact endpoint names**
- Correct: `GET /api/creators/alice`
- Wrong: `GET /api/creator/alice` (missing 's')

Use curl to test:
```bash
curl http://localhost:3001/api/creators/alice
curl http://localhost:3001/api/tips/creator_1
curl http://localhost:3001/api/health
```

### Problem: "POST /api/tips returns 'Creator not found'"

**Verify the creator_id exists:**
```bash
# These IDs should work:
# creator_1 (alice)
# creator_2 (bob)  
# creator_3 (charlie)

curl -X POST http://localhost:3001/api/tips \
  -H "Content-Type: application/json" \
  -d '{
    "tx_hash": "test",
    "amount": 5,
    "creator_id": "creator_1"
  }'
```

---

## Frontend Issues

### Problem: "Cannot find module 'next'"

**Solution:**
```bash
cd frontend
npm install

# Or clean install:
rm -rf node_modules package-lock.json
npm install
```

### Problem: "Compilation errors in frontend"

**Common causes:**
1. Missing `.env.local` file
2. Tailwind CSS not built
3. Next.js cache issues

**Solutions:**
```bash
# 1. Check if .env.local exists
cd frontend
ls -la .env.local

# If not, create it:
echo "NEXT_PUBLIC_API_BASE=http://localhost:3001/api" > .env.local

# 2. Clear Next.js cache
rm -rf .next

# 3. Rebuild
npm run dev
```

### Problem: "Tailwind CSS not applied (styling broken)"

**Solution:**
```bash
cd frontend

# Verify tailwind config exists
cat tailwind.config.js

# Clear cache and rebuild
rm -rf .next node_modules/.cache
npm run dev
```

### Problem: "Creator profile page shows 'Creator not found'"

**Solution: Verify the username in URL matches backend**

Valid URLs:
- `http://localhost:3000/alice` ✓
- `http://localhost:3000/bob` ✓
- `http://localhost:3000/charlie` ✓

Invalid:
- `http://localhost:3000/Alice` ✗ (case-sensitive)
- `http://localhost:3000/john` ✗ (doesn't exist)

### Problem: "Tip doesn't appear in activity feed"

**Debugging steps:**
1. Check browser console (F12) for errors
2. Verify tip was created: `curl http://localhost:3001/api/tips/creator_1`
3. Check network tab in DevTools to see POST request
4. Refresh the page to verify it persists

---

## CORS & Network Issues

### Problem: "CORS error in browser console"

**Error message:**
```
Access to XMLHttpRequest at 'http://localhost:3001/api/tips'
from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solution:**
Verify backend has CORS enabled:
```javascript
// In backend/src/server.js
import cors from 'cors';
app.use(cors());
```

If still blocked, check:
1. Backend is running
2. Port 3001 is correct
3. Backend has restarted after adding CORS

### Problem: "ERR_CONNECTION_REFUSED"

**Solution: Start the backend**
```bash
cd backend
npm run dev

# Verify it's running
curl http://localhost:3001/api/health
```

---

## Dependencies & Installation

### Problem: "npm ERR! code ERESOLVE"

**Solution: Force legacy peer dependencies**
```bash
npm install --legacy-peer-deps
```

### Problem: "node-gyp rebuild failed"

**Solution on macOS:**
```bash
xcode-select --install

# Then reinstall
npm install
```

**Solution on Windows:**
- Install Python 3.x
- Install Visual Studio Build Tools
- Try again: `npm install`

### Problem: "package-lock.json conflicts"

**Solution:**
```bash
# Backend
cd backend
rm package-lock.json
npm install

# Frontend
cd frontend
rm package-lock.json
npm install
```

---

## Development & Debugging

### Problem: "Hot reload not working"

**Backend:**
- Stop server: `Ctrl+C`
- Change file in `backend/src/`
- Run: `npm run dev` again

**Frontend:**
- Changes to `frontend/` should auto-reload
- If not, check: `npm run dev` is still running
- Clear browser cache if stuck

### Problem: "Console shows old code"

**Solution: Hard refresh browser**
```
Windows/Linux: Ctrl+Shift+R
macOS: Cmd+Shift+R
```

Or clear DevTools cache:
1. F12 → Network tab
2. Right-click → "Clear browser cache"
3. Refresh page

### Problem: "State not updating after tip"

**Debugging:**
1. Open DevTools (F12)
2. Check Network tab → POST /api/tips
3. Verify 201 response (not 400/404)
4. Check Console for JavaScript errors
5. Refresh page to verify persistence

---

## Environment Variables

### Problem: "Backend can't find .env"

**Solution: Create .env.local**
```bash
cd backend
cp .env.example .env.local

# Edit if needed:
echo "PORT=3001" >> .env.local
```

### Problem: "Frontend can't find .env.local"

**Solution: Create .env.local for Next.js**
```bash
cd frontend
echo "NEXT_PUBLIC_API_BASE=http://localhost:3001/api" > .env.local
```

Note: Next.js requires `NEXT_PUBLIC_` prefix for client-side vars.

---

## Git & Repository

### Problem: ".gitignore not working"

**Solution:**
```bash
# Remove cached files
git rm -r --cached .

# Re-add everything (respecting .gitignore)
git add .

# Commit
git commit -m "Fix .gitignore"
```

### Problem: "Cannot commit changes"

**Solution: Check git status**
```bash
git status

# Stage changes
git add .

# Commit
git commit -m "Your message"

# Or stash if you don't need them
git stash
```

---

## API Testing

### Problem: "curl command not recognized"

**Windows PowerShell:**
```powershell
# Use Invoke-WebRequest instead:
Invoke-WebRequest -Uri http://localhost:3001/api/health

# Or use curl (Windows 10.15.19041+):
curl http://localhost:3001/api/health
```

**Solution: Use REST client tool**
- Postman: https://www.postman.com/
- Thunder Client (VS Code extension)
- Insomnia: https://insomnia.rest/

### Problem: "POST request not working in curl"

**Correct syntax:**
```bash
curl -X POST http://localhost:3001/api/tips \
  -H "Content-Type: application/json" \
  -d '{
    "tx_hash": "test123",
    "amount": 5,
    "creator_id": "creator_1"
  }'
```

**Common mistakes:**
- Missing `-X POST`
- Missing `-H "Content-Type: application/json"`
- Missing `-d` for data
- Single quotes instead of double quotes (Windows)

---

## Smart Contract Issues

### Problem: "Rust/Cargo not installed"

**Solution:**
```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Add to PATH (sometimes needed)
source $HOME/.cargo/env

# Verify
rustc --version
```

### Problem: "soroban-cli not found"

**Solution:**
```bash
cargo install soroban-cli

# Verify
soroban --version
```

### Problem: "wasm32 target not installed"

**Solution:**
```bash
rustup target add wasm32-unknown-unknown

# Verify
rustc --print sysroot
```

---

## Browser Issues

### Problem: "Blank white page"

**Solutions:**
1. Check browser console (F12) for errors
2. Refresh page: F5 or Cmd+R
3. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
4. Clear cache: Settings → Clear browsing data
5. Verify frontend is running: `npm run dev`

### Problem: "Styling looks broken (no colors)"

**Solutions:**
1. Hard refresh browser (Ctrl+Shift+R)
2. Check Tailwind CSS is compiled
3. Verify `.env.local` exists with correct API URL
4. Check console for errors

### Problem: "Responsive design broken on mobile"

**Solutions:**
1. Open DevTools (F12)
2. Click device toggle (Ctrl+Shift+M)
3. Check viewport width
4. Refresh (Ctrl+R)
5. Verify media queries in `globals.css`

---

## Performance Issues

### Problem: "Page loads slowly"

**Causes & Solutions:**
- [ ] Backend slow → Check server logs
- [ ] Network slow → Check DevTools Network tab
- [ ] Many tips → Data might be large
- [ ] First load → Next.js building

**Debug:**
```bash
# Check backend response time
time curl http://localhost:3001/api/tips/creator_1

# Check frontend build time
npm run build
```

### Problem: "Memory usage high"

**Solutions:**
1. Restart both servers: `Ctrl+C`
2. Clear browser cache
3. Close other browser tabs
4. Check for infinite loops in code

---

## Nuclear Options (Last Resort)

### Option 1: Clean Restart
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install
npm run dev

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Option 2: Complete Reset
```bash
# Stop all servers (Ctrl+C)

# Backup your work
git stash

# Reset git
git reset --hard HEAD

# Reinstall everything
rm -rf backend/node_modules frontend/node_modules contract/target
npm install --prefix backend
npm install --prefix frontend
```

### Option 3: Nuclear Option
```bash
# Save important work first!

# Delete everything except .git and source files
git clean -fdx

# Reinstall
npm install --prefix backend
npm install --prefix frontend
```

---

## Getting Help

### Before asking for help:

1. ✓ Read error message carefully
2. ✓ Check [SETUP.md](./SETUP.md)
3. ✓ Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) (this file)
4. ✓ Test with curl: `curl http://localhost:3001/api/health`
5. ✓ Clear cache and restart servers
6. ✓ Check browser console (F12)
7. ✓ Check terminal output for errors

### Resources:

- [INDEX.md](./INDEX.md) - Documentation overview
- [API.md](./API.md) - API reference
- [SETUP.md](./SETUP.md) - Setup guide
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Development guidelines

### Known Limitations:

- **Database:** In-memory only (resets on restart)
- **Wallet:** Mock/non-functional
- **Blockchain:** Not integrated yet (testnet only)
- **Authentication:** None required (local dev)

---

## Common Success Patterns

### ✅ What should work:

```bash
# Backend running
curl http://localhost:3001/api/health
# Response: {"status":"ok","service":"cretip-backend"}

# Frontend running
# Visit http://localhost:3000
# See: Homepage with 3 creators

# API working
curl http://localhost:3001/api/creators/alice
# Response: Creator profile JSON

# Tip working
# Visit http://localhost:3000/alice
# Connect wallet → Select amount → Send tip
# See tip appear in feed
```

---

**Still stuck?** Check [CONTRIBUTING.md](./CONTRIBUTING.md) for support options.

**Good luck! 🚀**
