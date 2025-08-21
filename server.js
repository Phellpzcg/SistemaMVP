require('dotenv/config');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const pool = require('./db');

const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const appRoutes = require('./routes/app');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  store: new pgSession({
    pool,
    createTableIfMissing: true,
  }),
  secret: process.env.SESSION_SECRET || 'change_this_secret',
  resave: false,
  saveUninitialized: false,
  name: 'sid',
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  },
}));

app.use(express.static('public'));

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/app', appRoutes);

app.get('/api/session', (req, res) => {
  if (req.session && req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json({ user: null });
  }
});

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.get('/db-health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ db: 'up' });
  } catch (err) {
    const msg = err.message.split('\n')[0];
    res.status(500).json({ db: 'down', error: msg });
  }
});

const PORT = process.env.PORT || 3000;
(async () => {
  try {
    await pool.query('SELECT 1');
    console.log('Conexão PostgreSQL (Railway) OK');
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    const msg = err.message.split('\n')[0];
    console.error(`${err.code || 'DB_ERROR'} ${msg}`);
    process.exit(1);
  }
})();
