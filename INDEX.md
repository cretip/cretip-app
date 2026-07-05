# 📚 Cretip Documentation Index

Welcome to the Cretip project! Here's a guide to all documentation files.

## 🚀 Quick Start

**New to Cretip?** Start here:

1. **[QUICKSTART.sh](./QUICKSTART.sh)** or **[QUICKSTART.bat](./QUICKSTART.bat)** - One-command setup
2. **[SETUP.md](./SETUP.md)** - Detailed setup instructions
3. **[README.md](./README.md)** - Project overview

## 📖 Core Documentation

### Project Overview
- **[README.md](./README.md)** - High-level project intro, features, and local workflow
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System design, data flow, tech stack
- **[API.md](./API.md)** - Complete API reference with examples

### Setup & Development
- **[SETUP.md](./SETUP.md)** - Detailed installation guide with troubleshooting
- **[QUICKSTART.sh](./QUICKSTART.sh)** - Automated setup for Linux/macOS
- **[QUICKSTART.bat](./QUICKSTART.bat)** - Automated setup for Windows

### Contributing
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Development guidelines, code style, PR process

## 📁 Directory Guide

### `/backend`
Node.js Express API server

**Key Files:**
- `src/server.js` - Main Express server
- `package.json` - Dependencies and scripts
- `.eslintrc.json` - Linting configuration

**What it does:**
- Stores creator profiles
- Logs tip events
- Serves REST API endpoints

**Start:** `cd backend && npm run dev`

### `/frontend`
Next.js React user interface

**Key Files:**
- `app/page.js` - Homepage
- `app/[username]/page.js` - Creator profile page
- `components/TipCard.js` - Tipping interface
- `components/ActivityFeed.js` - Recent tips display
- `tailwind.config.js` - Design system

**What it does:**
- Display creator profiles
- Allow fans to send tips
- Show real-time activity feed

**Start:** `cd frontend && npm run dev`

### `/contract`
Soroban Rust smart contract

**Key Files:**
- `src/lib.rs` - Smart contract code
- `Cargo.toml` - Rust dependencies

**What it does:**
- Define `tip_creator()` function
- Handle on-chain XLM transfers
- Validate transactions

**Build:** `cd contract && cargo build --target wasm32-unknown-unknown --release`

## 🎯 Common Tasks

### I want to...

#### Start development
```bash
./QUICKSTART.sh    # macOS/Linux
# or
QUICKSTART.bat     # Windows

# Then in separate terminals:
cd backend && npm run dev
cd frontend && npm run dev
```

#### Test the API
See **[API.md](./API.md)** for:
- All endpoint documentation
- Request/response examples
- cURL, JavaScript, Python examples

#### Add a new creator
Edit `backend/src/server.js` and add to `creators` array

#### Create a new frontend page
Create file in `frontend/app/` (e.g., `about.js`)

#### Deploy to production
See **[ARCHITECTURE.md](./ARCHITECTURE.md#-deployment-targets)** for deployment targets

#### Report a bug
Check **[CONTRIBUTING.md](./CONTRIBUTING.md#questions-or-issues)** for issue guidelines

#### Learn code style
See **[CONTRIBUTING.md](./CONTRIBUTING.md#code-style)** for conventions

## 🔗 File Cross-Reference

| File | Purpose | Audience |
|------|---------|----------|
| README.md | Project overview | Everyone |
| SETUP.md | Installation guide | New developers |
| ARCHITECTURE.md | System design | Technical leads |
| API.md | API reference | Backend developers, integrators |
| CONTRIBUTING.md | Development guide | Contributors |
| LICENSE | Legal terms | Legal review |
| QUICKSTART.sh/bat | Automated setup | New developers |

## 📊 Project Statistics

```
Cretip App Monorepo
├── Backend       ~400 lines of code
├── Frontend      ~500 lines of code
└── Contract      ~150 lines of code

Total:           ~1,050 lines (MVP)
Dependencies:    ~25 npm packages
Commits:         Ready for initial push
```

## 🎨 Visual Architecture

```
Frontend                Backend              Smart Contract
(Next.js)              (Express)             (Soroban/Rust)
   │                      │                         │
   ├─ Homepage            ├─ /api/creators          ├─ tip_creator()
   ├─ Creator Profile     ├─ /api/tips              ├─ balance checks
   ├─ Tip Card            └─ /api/health            └─ XLM transfers
   └─ Activity Feed            │
                               ▼
                          In-Memory DB
                          - creators[]
                          - tips[]
```

## 🚀 Getting Started Checklist

- [ ] Node.js v18+ installed
- [ ] Rust & Cargo installed (for contract work)
- [ ] Soroban CLI installed (optional)
- [ ] Repository cloned
- [ ] Run QUICKSTART script
- [ ] Backend running on port 3001
- [ ] Frontend running on port 3000
- [ ] Visit http://localhost:3000
- [ ] Test tipping workflow

## 💡 Tips for Success

1. **Read SETUP.md first** - Don't skip steps
2. **Run both servers** - Frontend and backend must run together
3. **Test the API** - Use curl or Postman to verify endpoints
4. **Check port conflicts** - Default ports are 3000 and 3001
5. **Enable hot reload** - Makes development faster

## 🔍 Search Guide

Looking for something specific?

| Topic | File |
|-------|------|
| Setup issues | SETUP.md |
| API endpoints | API.md |
| Code style | CONTRIBUTING.md |
| System design | ARCHITECTURE.md |
| Feature roadmap | README.md or CONTRIBUTING.md |
| Environment variables | SETUP.md or API.md |
| Creator management | ARCHITECTURE.md or API.md |
| Smart contract | ARCHITECTURE.md or README.md |

## 📞 Support Resources

- **Documentation:** This Index (INDEX.md)
- **Setup Help:** SETUP.md troubleshooting section
- **API Questions:** API.md reference
- **Development:** CONTRIBUTING.md guidelines
- **Issues:** GitHub Issues (coming soon)
- **Discussions:** GitHub Discussions (coming soon)

## 📈 Project Maturity

**Status:** MVP (Minimum Viable Product)

- ✅ Local prototype working
- ✅ Full-stack boilerplate complete
- ✅ Mock tipping flow implemented
- ⏳ Real Stellar integration (next)
- ⏳ Production deployment (later)

## 🎓 Learning Resources

### Cretip-Specific
- README.md - Feature overview
- ARCHITECTURE.md - System design
- API.md - API patterns

### Stellar Blockchain
- [Stellar Docs](https://developers.stellar.org)
- [Soroban Docs](https://soroban.stellar.org)
- [XLM Token Guide](https://developers.stellar.org/learn)

### Technologies
- [Next.js Docs](https://nextjs.org/docs)
- [React Hooks](https://react.dev/reference/react)
- [Express.js Guide](https://expressjs.com)
- [Tailwind CSS](https://tailwindcss.com)

## 🎯 Next Steps

1. **Follow SETUP.md** to get running locally
2. **Test the tipping flow** on the UI
3. **Explore the API** with curl
4. **Review ARCHITECTURE.md** for system understanding
5. **Start coding!** See CONTRIBUTING.md for guidelines

---

**Last Updated:** July 2026
**Version:** 0.1.0 (MVP)
**License:** MIT

**Questions?** Check the relevant documentation file above, or open a GitHub issue.
