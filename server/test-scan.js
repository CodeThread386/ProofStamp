const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../.env' });

async function run() {
  try {
    const token = jwt.sign({ userId: 'cm5k8r2k50000r9v8c3m4k2d8' }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '1h' });
    console.log("Testing POST /monitor/scan/PS-2026-HAIWI...");
    const res = await axios.post('http://localhost:3001/monitor/scan/PS-2026-HAIWI', {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Response status:", res.status);
    console.log("Matches found:", res.data.matchesFound);
    console.log("External results:", res.data.externalResults);
  } catch (err) {
    console.error("FAILED", err.response?.data || err.message);
  }
}
run();
