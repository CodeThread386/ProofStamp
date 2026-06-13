const axios = require('axios');

const API_TOKEN = 'NdVoYKFCM0fdI4O/rci8TgGBEzWlqLv24EmcEzwDPh4dAmDNCwchuEWkPdgbwaZN';
const BASE_URL = 'https://api.dmca.com';

/**
 * Register a new user with DMCA
 */
async function registerUser(data) {
  const response = await axios.post(`${BASE_URL}/register`, data, {
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
}

/**
 * Log in to DMCA
 */
async function loginUser(email, password) {
  const response = await axios.post(`${BASE_URL}/login`, { email, password }, {
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
}

/**
 * Create a standard DMCA case
 */
async function createCase(data) {
  const response = await axios.post(`${BASE_URL}/createCase`, data, {
    headers: {
      'Content-Type': 'application/json',
      'Token': API_TOKEN,
    },
  });
  return response.data;
}

/**
 * List DMCA cases
 */
async function listCases(page = '') {
  let url = `${BASE_URL}/listCases`;
  if (page) url += `?page=${page}`;
  
  const response = await axios.get(url, {
    headers: {
      'Content-Type': 'application/json',
      'Token': API_TOKEN,
    },
  });
  return response.data;
}

/**
 * Get case by ID
 */
async function getCaseById(caseId) {
  const response = await axios.get(`${BASE_URL}/getCaseById?id=${caseId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Token': API_TOKEN,
    },
  });
  return response.data;
}

/**
 * Update a DMCA case
 */
async function updateCase(data) {
  const response = await axios.post(`${BASE_URL}/updateCase`, data, {
    headers: {
      'Content-Type': 'application/json',
      'Token': API_TOKEN,
    },
  });
  return response.data;
}

/**
 * Create a DIY DMCA Case
 */
async function createDIYCase(data) {
  const response = await axios.post(`${BASE_URL}/createDIYCase`, data, {
    headers: {
      'Content-Type': 'application/json',
      'Token': API_TOKEN,
    },
  });
  return response.data;
}

/**
 * List DIY DMCA Cases
 */
async function listDIYCases(page = '') {
  let url = `${BASE_URL}/listDIYCases`;
  if (page) url += `?page=${page}`;
  
  const response = await axios.get(url, {
    headers: {
      'Content-Type': 'application/json',
      'Token': API_TOKEN,
    },
  });
  return response.data;
}

/**
 * Create a Compliance Case
 */
async function createComplianceCase(data) {
  const response = await axios.post(`${BASE_URL}/createComplianceCase`, data, {
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
}

/**
 * List Compliance Cases
 */
async function listComplianceCases(page = '') {
  let url = `${BASE_URL}/listComplianceCases`;
  if (page) url += `?page=${page}`;
  
  const response = await axios.get(url, {
    headers: {
      'Content-Type': 'application/json',
      'Token': API_TOKEN,
    },
  });
  return response.data;
}

module.exports = {
  registerUser,
  loginUser,
  createCase,
  listCases,
  getCaseById,
  updateCase,
  createDIYCase,
  listDIYCases,
  createComplianceCase,
  listComplianceCases,
};
