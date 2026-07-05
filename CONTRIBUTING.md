# 🤝 Contributing to Cretip

We welcome contributions! This document outlines guidelines for developing and contributing to the Cretip project.

## Getting Started

1. **Fork & Clone:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/cretip-app.git
   cd cretip-app
   ```

2. **Set up development environment:**
   ```bash
   ./QUICKSTART.sh  # macOS/Linux
   # or
   QUICKSTART.bat   # Windows
   ```

3. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Backend Development

```bash
cd backend

# Start dev server with hot reload
npm run dev

# Run linter
npm run lint

# Build for production
npm run build
```

### Frontend Development

```bash
cd frontend

# Start Next.js dev server
npm run dev

# Run linter
npm run lint

# Build for production
npm run build
```

### Smart Contract Development

```bash
cd contract

# Build the contract
cargo build --target wasm32-unknown-unknown --release

# Run tests
cargo test

# Build for Soroban
soroban contract build
```

## Code Style

### JavaScript/TypeScript

- Use ES6+ syntax
- Follow ESLint rules (run `npm run lint`)
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused

Example:
```javascript
// ✅ Good
const getTipAmount = (selectedAmount, customAmount) => {
  return customAmount ? parseFloat(customAmount) : selectedAmount;
};

// ❌ Avoid
const getAmount = (a, c) => c ? parseFloat(c) : a;
```

### React Components

- Use functional components with hooks
- One component per file
- Export as default
- Use PascalCase for component names
- Use destructuring for props

Example:
```javascript
// ✅ Good
const ActivityFeed = ({ tips, creatorName }) => {
  return (
    <div className="card">
      {/* Component JSX */}
    </div>
  );
};

export default ActivityFeed;
```

### Tailwind CSS

- Use utility-first approach
- Avoid inline styles
- Use custom colors from theme config
- Keep responsive design mobile-first

Example:
```jsx
// ✅ Good
<button className="px-4 py-2 bg-neon-cyan text-dark-bg rounded-lg hover:shadow-glow-cyan">
  Send
</button>

// ❌ Avoid
<button style={{ padding: '0.5rem 1rem', backgroundColor: '#00F0FF' }}>
  Send
</button>
```

### Rust (Smart Contract)

- Follow Rust idioms
- Use meaningful error messages
- Add documentation comments
- Test all functions

Example:
```rust
/// Transfer XLM from caller to creator
/// 
/// # Arguments
/// * `env` - Soroban environment
/// * `shares` - Amount in stroops
/// * `creator_address` - Recipient wallet
pub fn tip_creator(env: Env, shares: i128, creator_address: Address) -> bool {
    // Implementation
}
```

## Commit Messages

Write clear, descriptive commit messages:

```
feat: Add tip amount presets to creator profile
fix: Correct timezone calculation in activity feed
docs: Update API documentation with examples
refactor: Simplify TipCard component
chore: Update dependencies
```

### Format:
```
<type>(<scope>): <subject>

<body>

<footer>
```

Types: `feat`, `fix`, `docs`, `refactor`, `chore`, `test`, `style`

## Pull Request Process

1. **Update your branch with latest main:**
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create Pull Request:**
   - Clear title and description
   - Reference related issues
   - Include screenshots for UI changes
   - Test locally before submitting

4. **PR Description Template:**
   ```markdown
   ## Changes
   - Brief description of changes
   
   ## Type
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Documentation update
   - [ ] Performance improvement
   
   ## Testing
   - [ ] Tested locally
   - [ ] All tests pass
   
   ## Screenshots (if applicable)
   [Paste screenshots here]
   ```

## Testing

### Frontend Testing

```bash
cd frontend

# Run tests (setup needed)
npm test

# Run linter
npm run lint
```

### Backend Testing

```bash
cd backend

# Run tests (setup needed)
npm test

# Run linter
npm run lint
```

### Manual Testing Checklist

Before submitting a PR:

- [ ] Backend API endpoints work correctly
- [ ] Frontend loads without errors
- [ ] Creator profiles display properly
- [ ] Tipping flow works end-to-end
- [ ] Activity feed updates in real-time
- [ ] Error messages display correctly
- [ ] Responsive design works on mobile

## Common Tasks

### Adding a New API Endpoint

1. **Create the route handler** in `backend/src/server.js`:
   ```javascript
   app.get('/api/new-endpoint', (req, res) => {
     // Handler logic
     res.json({ /* response */ });
   });
   ```

2. **Test with curl**:
   ```bash
   curl http://localhost:3001/api/new-endpoint
   ```

3. **Document in** `API.md`

### Adding a New Frontend Page

1. **Create file** in `frontend/app/`:
   ```bash
   touch frontend/app/new-page.js
   ```

2. **Export default component**:
   ```javascript
   export default function NewPage() {
     return <div>Page content</div>;
   }
   ```

3. **Route is automatically** `/new-page`

### Adding a New Component

1. **Create file** in `frontend/components/`:
   ```bash
   touch frontend/components/NewComponent.js
   ```

2. **Export as default**:
   ```javascript
   export default function NewComponent({ props }) {
     return <div>Component</div>;
   }
   ```

3. **Import in pages**:
   ```javascript
   import NewComponent from '@/components/NewComponent';
   ```

### Adding Dependencies

**Before adding a dependency, discuss in an issue!**

```bash
# Backend
cd backend
npm install package-name

# Frontend
cd frontend
npm install package-name

# Keep versions locked
npm install package-name@^1.0.0
```

## Roadmap & Future Features

### Phase 1: MVP (Current)
- ✅ Creator profiles
- ✅ Mock tipping UI
- ✅ Activity feed
- ✅ Backend API

### Phase 2: Stellar Integration
- [ ] Real Stellar wallet connection (Freighter)
- [ ] Testnet XLM transfers
- [ ] Transaction verification
- [ ] Real transaction hashes

### Phase 3: Creator Onboarding
- [ ] Creator registration
- [ ] Profile customization
- [ ] Withdrawal management
- [ ] Analytics dashboard

### Phase 4: Community
- [ ] Creator categories/discovery
- [ ] Tips leaderboard
- [ ] Social features
- [ ] Notifications

## Questions or Issues?

- **Bug reports:** Open a GitHub issue with reproduction steps
- **Feature requests:** Open a GitHub issue with use case
- **Questions:** Start a GitHub discussion
- **Security issues:** Email security@cretip.dev (don't use public issues)

## Code of Conduct

- Be respectful and inclusive
- No harassment, discrimination, or hate speech
- Focus on constructive criticism
- Help others learn and grow

## License

By contributing, you agree your code will be licensed under the MIT License.

---

Thank you for contributing to Cretip! 🚀
