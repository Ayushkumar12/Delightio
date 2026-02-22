require('dotenv').config();
const express = require('express');
const app = express();
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const Stripe = require('stripe');
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, get, push, child } = require('firebase/database');

const firebaseConfig = {
  apiKey: 'AIzaSyBnnUtNzcnw0UYR8ikFJptHkuzZFkvp4k4',
  authDomain: 'online-food-order-80833.firebaseapp.com',
  databaseURL: 'https://online-food-order-80833-default-rtdb.firebaseio.com',
  projectId: 'online-food-order-80833',
  storageBucket: 'online-food-order-80833.appspot.com',
  messagingSenderId: '980243962311',
  appId: '1:980243962311:web:6c80cf64470477b1bc21e2',
  measurementId: "G-FF4PLG3S2T"
};

const appFirebase = initializeApp(firebaseConfig);
const database = getDatabase(appFirebase);
const dbRef = ref(database);
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? Stripe(stripeSecretKey) : null;
const clientBaseUrl = process.env.CLIENT_URL || 'http://localhost:3000';
const normalizeOrigin = (origin) => origin.trim().replace(/\/+$/, '');
const corsOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)
  .map(normalizeOrigin);
const defaultOrigins = [
  clientBaseUrl,
  'http://localhost:3000',
  'http://localhost:3001',
  'https://delightio.vercel.app'
]
  .filter(Boolean)
  .map(normalizeOrigin);
const allowedOrigins = Array.from(new Set([...defaultOrigins, ...corsOrigins]));
const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(normalizeOrigin(origin))) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
};

app.use(cors(corsOptions));
app.use(express.json());

// Honor X-Forwarded-For when behind proxies
app.set('trust proxy', true);

// Ensure logs directory exists
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Helper to append a log line (JSONL) and mirror to console
function appendLog(entry) {
  const enriched = { ts: new Date().toISOString(), ...entry };
  const line = JSON.stringify(enriched) + '\n';
  fs.appendFile(path.join(logsDir, 'server.log'), line, (err) => {
    if (err) console.error('Failed to write log:', err);
  });
  // Console output in human-readable form
  const { ts, level = 'info', message = '', ...rest } = enriched;
  const ipOut = rest.ip ? ` [ip: ${rest.ip}]` : '';
  const prefix = `[${ts}] ${String(level).toUpperCase()}${ipOut}`;
  const { ip, ...restNoIp } = rest;
  if (Object.keys(restNoIp).length > 0) {
    console.log(`${prefix}: ${message}`, restNoIp);
  } else {
    console.log(`${prefix}: ${message}`);
  }
}

app.get('/', (req, res) => {
  get(child(dbRef, 'menu'))
    .then((snapshot) => {
      if (snapshot.exists()) {
        res.json(snapshot.val());
      } else {
        res.status(404).json({ message: 'No menu items found' });
      }
    })
    .catch((error) => {
      console.error('Error retrieving menu:', error);
      appendLog({ level: 'error', route: '/menu', message: 'Error retrieving menu', error: String(error), ip: req.ip });
      res.status(500).json({ message: 'Error retrieving menu' });
    });
});

app.get('/menu', (req, res) => {
  get(child(dbRef, 'menu'))
    .then((snapshot) => {
      if (snapshot.exists()) {
        res.json(snapshot.val());
      } else {
        res.status(404).json({ message: 'No menu items found' });
      }
    })
    .catch((error) => {
      console.error('Error retrieving menu:', error);
      appendLog({ level: 'error', route: '/menu', message: 'Error retrieving menu', error: String(error), ip: req.ip });
      res.status(500).json({ message: 'Error retrieving menu' });
    });
});
app.post('/menu', (req, res) => {
    if (!req.body.dish_Name || !req.body.dish_Price || !req.body.dish_Id) {
      console.log('Invalid dish data');
      appendLog({ level: 'warn', route: '/menu', message: 'Invalid dish data', body: req.body, ip: req.ip });
      res.status(400).send({ message: 'Invalid dish data' });
    } else {
      push(child(dbRef, 'menu'), req.body)
        .then(() => {
          console.log('dish submitted successfully');
          appendLog({ level: 'info', route: '/menu', message: 'Dish submitted', dish_Id: req.body.dish_Id, ip: req.ip });
          res.json({ message: 'dish submitted successfully' });
        })
        .catch((error) => {
          console.error('Error submitting dish:', error);
          appendLog({ level: 'error', route: '/menu', message: 'Error submitting dish', error: String(error), ip: req.ip });
          res.status(500).json({ message: 'Error submitting dish' });
        });
    }
  });
app.post('/orders', (req, res) => {
  if (!req.body.customerName || !req.body.Table || !req.body.menuItems) {
    console.log('Invalid order data');
    appendLog({ level: 'warn', route: '/orders', message: 'Invalid order data', body: req.body, ip: req.ip });
    res.status(400).send({ message: 'Invalid order data' });
  } else {
    push(child(dbRef, 'orders'), req.body)
      .then(() => {
        console.log('Order submitted successfully');
        appendLog({ level: 'info', route: '/orders', message: 'Order submitted', customerName: req.body.customerName, ip: req.ip });
        res.json({ message: 'Order submitted successfully' });
      })
      .catch((error) => {
        console.error('Error submitting order:', error);
        appendLog({ level: 'error', route: '/orders', message: 'Error submitting order', error: String(error), ip: req.ip });
        res.status(500).json({ message: 'Error submitting order' });
      });
  }
});

app.post('/contact', (req, res) => {
  const {
    name,
    email,
    phone,
    topic,
    guests,
    message,
  } = req.body || {};
  if (!name || !email || !message) {
    appendLog({ level: 'warn', route: '/contact', message: 'Invalid contact submission', body: req.body, ip: req.ip });
    return res.status(400).json({ message: 'Name, email, and message are required' });
  }
  const payload = {
    name: String(name).trim(),
    email: String(email).trim().toLowerCase(),
    phone: phone ? String(phone).trim() : '',
    topic: topic ? String(topic).trim() : 'general',
    guests: guests ? String(guests).trim() : '',
    message: String(message).trim(),
    submittedAt: Date.now(),
    userAgent: req.headers['user-agent'] || '',
    ip: req.ip,
  };
  push(child(dbRef, 'contactRequests'), payload)
    .then((refSnapshot) => {
      appendLog({ level: 'info', route: '/contact', message: 'Contact request stored', key: refSnapshot.key, email: payload.email, ip: req.ip });
      res.json({ message: 'Thanks for contacting Delightio' });
    })
    .catch((error) => {
      appendLog({ level: 'error', route: '/contact', message: 'Failed to store contact request', error: String(error), ip: req.ip });
      res.status(500).json({ message: 'Could not store contact request' });
    });
});

app.post('/checkout', async (req, res) => {
  const { customerName, Table, menuItems, successUrl, cancelUrl } = req.body || {};
  if (!customerName || !Table || !Array.isArray(menuItems) || menuItems.length === 0) {
    appendLog({ level: 'warn', route: '/checkout', message: 'Invalid checkout data', body: req.body, ip: req.ip });
    return res.status(400).json({ message: 'Invalid checkout data' });
  }
  if (!stripe) {
    appendLog({ level: 'error', route: '/checkout', message: 'Stripe secret key not configured', ip: req.ip });
    return res.status(500).json({ message: 'Payment service unavailable' });
  }
  try {
    let totalCost = 0;
    const lineItems = menuItems.map((item) => {
      const name = String(item.dish_Name || '').trim();
      const price = Number(item.dish_Price);
      const quantity = Number(item.quantity) || 1;
      if (!name || Number.isNaN(price) || price <= 0 || Number.isNaN(quantity) || quantity <= 0) {
        const err = new Error('INVALID_LINE_ITEM');
        err.details = { name, price, quantity };
        throw err;
      }
      totalCost += price * quantity;
      return {
        price_data: {
          currency: 'inr',
          product_data: { name },
          unit_amount: Math.round(price * 100),
        },
        quantity,
      };
    });
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      success_url: successUrl || `${clientBaseUrl}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${clientBaseUrl}?payment=cancelled`,
      metadata: {
        customerName: String(customerName),
        table: String(Table),
      },
    });
    await push(child(dbRef, 'orders'), {
      customerName,
      Table,
      menuItems,
      totalCost,
      paymentStatus: 'pending',
      stripeSessionId: session.id,
    });
    appendLog({ level: 'info', route: '/checkout', message: 'Checkout session created', customerName, stripeSessionId: session.id, ip: req.ip });
    res.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    if (error.message === 'INVALID_LINE_ITEM' && error.details) {
      appendLog({ level: 'warn', route: '/checkout', message: 'Invalid line item', details: error.details, ip: req.ip });
      return res.status(400).json({ message: 'Invalid menu items' });
    }
    console.error('Error creating checkout session:', error);
    appendLog({ level: 'error', route: '/checkout', message: 'Error creating checkout session', error: String(error), ip: req.ip });
    res.status(500).json({ message: 'Error creating checkout session' });
  }
});

app.post('/Users', (req, res) => {
  if (!req.body.UserName || !req.body.Email) {
    console.log('Invalid data');
    appendLog({ level: 'warn', route: '/Users', message: 'Invalid user data', body: req.body, ip: req.ip });
    res.status(400).send({ message: 'Invalid data' });
  } else {
    push(dbRef.child('Users'), req.body).then(() => {
      console.log('User registered successfully');
      appendLog({ level: 'info', route: '/Users', message: 'User registered', user: req.body.UserName, ip: req.ip });
      res.send({ message: 'User registered successfully' });
    }).catch((error) => {
      console.error('Error registering User:', error);
      appendLog({ level: 'error', route: '/Users', message: 'Error registering user', error: String(error), ip: req.ip });
      res.status(500).send({ message: 'Error registering User' });
    });
  }
});

// Route to append arbitrary server log entries (captures requester IP)
// Body example: { level: 'info', message: 'Something happened', meta: {...} }
app.post('/logs', (req, res) => {
  const { level = 'info', message = '', meta = {} } = req.body || {};
  if (!message) {
    return res.status(400).json({ message: 'message is required' });
  }
  const ip = req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress;
  appendLog({ level, message, meta, route: '/logs', ip });
  res.json({ message: 'Logged' });
});

app.listen(3001, () => {
  console.log('Server listening on port 3001');
  appendLog({ level: 'info', message: 'Server started', port: 3001 });
});