import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = process.env.PORT || 3001;

// Stellar public key: starts with 'G', followed by exactly 55 uppercase alphanumeric chars (base32)
const STELLAR_ADDRESS_REGEX = /^G[A-Z0-9]{55}$/;

/**
 * Validates a Stellar public key string.
 * Returns an error message string if invalid, or null if valid.
 */
const validateStellarAddress = (address) => {
  if (!address || typeof address !== 'string') {
    return 'Stellar wallet address is required and must be a string.';
  }
  if (!STELLAR_ADDRESS_REGEX.test(address)) {
    return 'Invalid Stellar wallet address. Must start with "G" and be exactly 56 uppercase alphanumeric characters.';
  }
  return null;
};

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database - Pre-seeded with test accounts
const users = [
  {
    id: 'user_1',
    username: 'alice',
    password: 'password123',
    stellar_wallet_address: 'GBXYZ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890AB',
    is_creator: true,
    creator_profile: {
      url_slug: 'alice',
      display_name: 'Alice Creator',
      bio: 'Digital artist & musician',
      social_links: { twitter: '@alice', youtube: '', twitch: '' },
      category: 'art',
    },
    balance: 1000.00,
    created_at: new Date().toISOString(),
  },
  {
    id: 'user_2',
    username: 'bob',
    password: 'password123',
    stellar_wallet_address: null,
    is_creator: false,
    creator_profile: null,
    balance: 500.00,
    created_at: new Date().toISOString(),
  },
];

const tips = [];

// Helper: Find user by username
const findUserByUsername = (username) => users.find(u => u.username === username);

// Helper: Find user by ID
const findUserById = (id) => users.find(u => u.id === id);

// POST /api/auth/register
app.post('/api/auth/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  if (findUserByUsername(username)) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  const newUser = {
    id: uuidv4(),
    username,
    password, // In production, hash this with bcrypt
    stellar_wallet_address: null,
    is_creator: false,
    creator_profile: null,
    balance: 100.00, // New users start with $100
    created_at: new Date().toISOString(),
  };

  users.push(newUser);

  res.status(201).json({
    success: true,
    user: {
      id: newUser.id,
      username: newUser.username,
      is_creator: newUser.is_creator,
      balance: newUser.balance,
    },
  });
});

// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const user = findUserByUsername(username);

  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      username: user.username,
      is_creator: user.is_creator,
      creator_profile: user.creator_profile,
      stellar_wallet_address: user.stellar_wallet_address,
      balance: user.balance,
    },
  });
});

// POST /api/user/activate-creator
app.post('/api/user/activate-creator', (req, res) => {
  const { user_id, url_slug, display_name, bio, stellar_wallet_address, social_links, category } = req.body;

  if (!user_id) {
    return res.status(400).json({ errors: ['User ID required'] });
  }

  const user = findUserById(user_id);

  if (!user) {
    return res.status(404).json({ errors: ['User not found'] });
  }

  if (!url_slug || !display_name) {
    return res.status(400).json({ errors: ['URL slug and display name required'] });
  }

  // Check if slug is already taken
  const slugExists = users.some(u => u.creator_profile?.url_slug === url_slug && u.id !== user_id);
  if (slugExists) {
    return res.status(400).json({ errors: ['URL slug already taken'] });
  }

  // Validate Stellar wallet address when provided
  if (stellar_wallet_address) {
    const walletError = validateStellarAddress(stellar_wallet_address);
    if (walletError) {
      return res.status(400).json({ errors: [walletError] });
    }
  }

  user.is_creator = true;
  user.stellar_wallet_address = stellar_wallet_address || null;
  user.creator_profile = {
    url_slug,
    display_name,
    bio,
    social_links: social_links || { twitter: '', youtube: '', twitch: '' },
    category: category || '',
  };

  res.json({
    success: true,
    user: {
      id: user.id,
      username: user.username,
      is_creator: user.is_creator,
      creator_profile: user.creator_profile,
      balance: user.balance,
    },
  });
});

// GET /api/user/:user_id
app.get('/api/user/:user_id', (req, res) => {
  const { user_id } = req.params;
  const user = findUserById(user_id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    id: user.id,
    username: user.username,
    is_creator: user.is_creator,
    creator_profile: user.creator_profile,
    stellar_wallet_address: user.stellar_wallet_address,
    balance: user.balance,
  });
});

// POST /api/user/update-wallet - Update user's stellar wallet address
app.post('/api/user/update-wallet', (req, res) => {
  const { user_id, stellar_wallet_address } = req.body;

  if (!user_id || !stellar_wallet_address) {
    return res.status(400).json({ errors: ['User ID and wallet address required'] });
  }

  const user = findUserById(user_id);

  if (!user) {
    return res.status(404).json({ errors: ['User not found'] });
  }

  // Validate Stellar wallet address format using canonical regex
  const walletError = validateStellarAddress(stellar_wallet_address);
  if (walletError) {
    return res.status(400).json({ errors: [walletError] });
  }

  user.stellar_wallet_address = stellar_wallet_address;

  res.json({
    success: true,
    user: {
      id: user.id,
      username: user.username,
      is_creator: user.is_creator,
      creator_profile: user.creator_profile,
      stellar_wallet_address: user.stellar_wallet_address,
      balance: user.balance,
    },
  });
});

// GET /api/creator/:url_slug - Public creator profile
app.get('/api/creator/:url_slug', (req, res) => {
  const { url_slug } = req.params;
  const user = users.find(u => u.creator_profile?.url_slug === url_slug);

  if (!user) {
    return res.status(404).json({ error: 'Creator not found' });
  }

  res.json({
    id: user.id,
    username: user.username,
    creator_profile: user.creator_profile,
    stellar_wallet_address: user.stellar_wallet_address,
  });
});

// GET /api/creators/search - Search for creators by username
app.get('/api/creators/search', (req, res) => {
  const { query } = req.query;

  if (!query || query.trim().length === 0) {
    return res.json([]);
  }

  const searchTerm = query.toLowerCase().trim();
  const results = users
    .filter(u => u.is_creator && (u.username.toLowerCase().includes(searchTerm) || u.creator_profile?.display_name.toLowerCase().includes(searchTerm)))
    .map(u => ({
      id: u.id,
      username: u.username,
      display_name: u.creator_profile?.display_name,
      url_slug: u.creator_profile?.url_slug,
      category: u.creator_profile?.category,
    }))
    .slice(0, 10); // Limit to 10 results

  res.json(results);
});

// POST /api/tips - Log a tip event with balance transfer
app.post('/api/tips', (req, res) => {
  const { tx_hash, amount, sender, creator_id, timestamp, currency } = req.body;

  if (!tx_hash || !amount || !sender || !creator_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const senderUser = findUserById(sender);
  if (!senderUser) {
    return res.status(404).json({ error: 'Sender not found' });
  }

  const creator = findUserById(creator_id);
  if (!creator || !creator.is_creator) {
    return res.status(404).json({ error: 'Creator not found' });
  }

  const tipAmount = parseFloat(amount);
  const tipCurrency = currency || 'USDC'; // Default to USDC
  
  // Validate amount is positive
  if (tipAmount <= 0) {
    return res.status(400).json({ error: 'Tip amount must be greater than 0' });
  }

  // Validate sender has sufficient balance
  if (senderUser.balance < tipAmount) {
    return res.status(400).json({ error: `Insufficient balance. You have $${senderUser.balance.toFixed(2)}, but are trying to send $${tipAmount.toFixed(2)}` });
  }

  // Deduct from sender and credit to creator
  senderUser.balance -= tipAmount;
  creator.balance += tipAmount;

  const tip = {
    id: uuidv4(),
    tx_hash,
    amount: tipAmount,
    currency: tipCurrency,
    sender,
    creator_id,
    timestamp: timestamp || new Date().toISOString(),
  };

  tips.push(tip);

  res.status(201).json({
    success: true,
    tip,
    senderBalance: senderUser.balance,
    creatorBalance: creator.balance,
  });
});

// GET /api/tips/sent/:user_id - Get tips sent by a user
app.get('/api/tips/sent/:user_id', (req, res) => {
  const { user_id } = req.params;

  const userTips = tips
    .filter(t => t.sender === user_id || (t.sender !== 'Anonymous' && users.find(u => u.id === user_id)))
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  res.json(userTips);
});

// GET /api/tips/received/:creator_id - Get tips received by creator
app.get('/api/tips/received/:creator_id', (req, res) => {
  const { creator_id } = req.params;

  const creatorTips = tips
    .filter(t => t.creator_id === creator_id)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  res.json(creatorTips);
});

// GET /api/health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'cretip-backend' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✨ Cretip Backend running on http://localhost:${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log('\n📝 Pre-seeded Test Accounts:');
  console.log('  Creator: alice / password123');
  console.log('  Fan: bob / password123');
});
