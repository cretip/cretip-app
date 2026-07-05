# ✅ Cretip Development Checklist

Track your progress through setting up and developing Cretip.

## Prerequisites Verification

- [ ] Node.js v18+ installed (`node --version`)
- [ ] npm 9+ installed (`npm --version`)
- [ ] Git installed (`git --version`)
- [ ] (Optional) Rust & Cargo installed (`rustc --version`)
- [ ] (Optional) Soroban CLI installed (`soroban --version`)

## Initial Setup

- [ ] Repository cloned
- [ ] Running from `cretip-app/` directory
- [ ] No port conflicts (3000, 3001 free)
- [ ] Read [INDEX.md](./INDEX.md) for documentation overview
- [ ] Read [SETUP.md](./SETUP.md) for detailed setup

## Backend Setup

- [ ] Navigated to `backend/` directory
- [ ] Ran `npm install`
- [ ] Checked `.env.example` for configuration
- [ ] Created `.env.local` if needed (optional for local dev)
- [ ] Ran `npm run dev`
- [ ] Backend running on `http://localhost:3001`
- [ ] Health check passes: `curl http://localhost:3001/api/health`

### Backend Verification

- [ ] GET `/api/creators/alice` returns creator object
- [ ] GET `/api/creators/bob` returns creator object
- [ ] GET `/api/creators/unknown` returns 404
- [ ] POST `/api/tips` creates new tip entry
- [ ] GET `/api/tips/creator_1` returns tips array
- [ ] No console errors in terminal

## Frontend Setup

- [ ] Navigated to `frontend/` directory
- [ ] Ran `npm install`
- [ ] Checked `.env.example` for configuration
- [ ] Created `.env.local` if needed (optional for local dev)
- [ ] Ran `npm run dev`
- [ ] Frontend running on `http://localhost:3000`
- [ ] No build errors in console

### Frontend Verification

- [ ] Homepage loads (`http://localhost:3000`)
- [ ] Homepage displays 3 creators (Alice, Bob, Charlie)
- [ ] "Featured Creators" section visible
- [ ] Each creator card shows:
  - [ ] Creator name
  - [ ] Username
  - [ ] Bio
  - [ ] "Tip Now" button
- [ ] Can click creator card and navigate to `/[username]`

## Creator Profile Page Testing

**Navigate to: `http://localhost:3000/alice`**

- [ ] Profile page loads
- [ ] Creator name displays: "Alice Creator"
- [ ] Username displays: "@alice"
- [ ] Bio displays correctly
- [ ] 👑 Emoji visible
- [ ] Stellar wallet address visible
- [ ] "Send a Tip 💸" card on right side
- [ ] Activity feed ("Recent Tips 🕒") on right side

## Wallet Connection Testing

**On creator profile page:**

- [ ] "Connect Wallet to Tip" button visible
- [ ] Clicking button changes to "✅ Wallet connected"
- [ ] After connection, wallet state persists on page

## Tipping Flow Testing

**On creator profile page with wallet connected:**

### Preset Amounts

- [ ] Can click "$2" button (turns cyan)
- [ ] Can click "$5" button (turns cyan)
- [ ] Can click "$10" button (turns cyan)
- [ ] Only one button can be selected at a time

### Custom Amount

- [ ] Custom amount input field visible
- [ ] Can type numbers into field
- [ ] Typing clears preset selection
- [ ] Negative numbers handled gracefully

### Send Tip

- [ ] "Send Tip" button clickable when amount selected
- [ ] Button shows "⏳ Processing..." while sending
- [ ] After success: green feedback message appears
- [ ] Message format: "✅ Tipped X XLM to [Creator Name]!"
- [ ] Form resets after successful tip
- [ ] Feedback disappears after 3 seconds

## Activity Feed Testing

**After sending tip(s):**

- [ ] New tip appears at top of activity feed
- [ ] Tip shows correct:
  - [ ] Sender name ("You")
  - [ ] Amount in XLM (green text)
  - [ ] "just now" timestamp
  - [ ] Transaction hash (first 16 chars)
  - [ ] 💸 emoji
- [ ] Multiple tips display in reverse chronological order
- [ ] Total raised amount updates at bottom

## API Integration Testing

**Backend running:**

```bash
# Test creator retrieval
curl http://localhost:3001/api/creators/alice

# Test tip posting
curl -X POST http://localhost:3001/api/tips \
  -H "Content-Type: application/json" \
  -d '{
    "tx_hash": "test_tx_'$(date +%s)'",
    "amount": 5,
    "sender": "Test",
    "creator_id": "creator_1"
  }'

# Test tip retrieval
curl http://localhost:3001/api/tips/creator_1 | jq
```

- [ ] All requests return expected responses
- [ ] No CORS errors in browser console
- [ ] No 404 errors for valid endpoints

## Code Quality Checks

### Backend

- [ ] No console errors
- [ ] Run `npm run lint` - no errors
- [ ] All endpoints documented in [API.md](./API.md)

### Frontend

- [ ] No console errors
- [ ] No React warnings
- [ ] No Next.js warnings
- [ ] Run `npm run lint` - no errors
- [ ] Responsive on mobile view

## Smart Contract (Optional)

- [ ] Navigated to `contract/` directory
- [ ] Ran `cargo build --target wasm32-unknown-unknown --release`
- [ ] No build errors
- [ ] WASM artifact generated in `target/wasm32-unknown-unknown/release/`

## Documentation Review

- [ ] [README.md](./README.md) - Project overview ✓
- [ ] [SETUP.md](./SETUP.md) - Setup guide ✓
- [ ] [ARCHITECTURE.md](./ARCHITECTURE.md) - System design ✓
- [ ] [API.md](./API.md) - API reference ✓
- [ ] [CONTRIBUTING.md](./CONTRIBUTING.md) - Dev guidelines ✓

## Full-Stack Integration Test

Complete workflow from browser to backend:

1. [ ] Backend running (`npm run dev` in `backend/`)
2. [ ] Frontend running (`npm run dev` in `frontend/`)
3. [ ] Visit `http://localhost:3000/alice`
4. [ ] Click "Connect Wallet to Tip"
5. [ ] Select "$5" tip amount
6. [ ] Click "Send Tip"
7. [ ] See success message
8. [ ] See new tip in activity feed
9. [ ] Refresh page - tip still visible
10. [ ] Check backend: `curl http://localhost:3001/api/tips/creator_1`

## Git Repository

- [ ] `.gitignore` configured properly
- [ ] No secrets in repository
- [ ] `.env` files not committed (verify in `.gitignore`)
- [ ] `node_modules/` not committed
- [ ] Ready for initial commit

## Development Environment

- [ ] Have a code editor open (VS Code recommended)
- [ ] Can edit and save files
- [ ] Hot reload working:
  - [ ] Backend: Changes reload automatically
  - [ ] Frontend: Changes rebuild automatically
- [ ] Console/terminal visible for debugging

## Browser Compatibility

- [ ] Works in Chrome/Chromium ✓
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in Edge
- [ ] Mobile responsive (test with dev tools)

## Error Handling

- [ ] Non-existent creator returns 404
- [ ] Missing tip amount shows error
- [ ] Network errors handled gracefully
- [ ] Invalid tip amounts rejected
- [ ] All error messages user-friendly

## Performance

- [ ] Homepage loads quickly (<2s)
- [ ] Creator profile loads quickly (<2s)
- [ ] Tip sends without lag (<1s)
- [ ] No memory leaks on refresh
- [ ] No console warnings

## Next Steps

After all items checked:

### Ready to Deploy
- [ ] Read [CONTRIBUTING.md](./CONTRIBUTING.md#deployment-targets)
- [ ] Plan deployment strategy
- [ ] Set up production environment

### Ready to Develop
- [ ] Read [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines
- [ ] Create feature branch
- [ ] Start implementing new features

### Ready to Integrate with Stellar
- [ ] Install Freighter wallet
- [ ] Get testnet XLM faucet
- [ ] Implement real Stellar SDK
- [ ] Update smart contract with real transfer logic

## Troubleshooting Checklist

If something isn't working:

- [ ] Check that both backend and frontend are running
- [ ] Verify ports 3000 and 3001 are available
- [ ] Clear browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)
- [ ] Check browser console for errors (F12)
- [ ] Check terminal console for errors
- [ ] Try restarting both servers
- [ ] Check [SETUP.md](./SETUP.md) troubleshooting section

## Final Verification

Before considering setup complete:

- [ ] Can navigate between pages without errors
- [ ] Can complete full tipping workflow
- [ ] All API endpoints accessible
- [ ] No console errors or warnings
- [ ] Documentation is clear and accurate
- [ ] Ready to start feature development

---

## Summary

**Total Items:** 100+
**Estimated Time:** 30-45 minutes for first-time setup

**Status:** [ ] Ready to use | [ ] In Progress | [ ] Blocked

**Next Action:** Choose one from "Next Steps" above

---

**Questions?** See [INDEX.md](./INDEX.md) or [CONTRIBUTING.md](./CONTRIBUTING.md)

Good luck! 🚀
