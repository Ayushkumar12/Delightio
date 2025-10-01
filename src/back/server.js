const express = require('express');
const app = express();
const fs = require('fs');
const cors = require('cors')
const path = require('path');
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

app.use(express.json(),cors());

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