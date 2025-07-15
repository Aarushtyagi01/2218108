// Token and client management utilities

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

function getAuthHeader() {
  return {
    'Authorization': `Bearer ${ACCESS_TOKEN}`
  };
}

function getClientCredentials() {
  return {
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET
  };
}

module.exports = { getAuthHeader, getClientCredentials }; 