require("dotenv").config();
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

const TOKEN_PATH = path.join(__dirname, '../personal-token.json');

const oAuth2Client = new google.auth.OAuth2(
  process.env.GCP_CLIENT_ID,
  process.env.GCP_CLIENT_SECRET,
  process.env.GCP_REDIRECT_URI,
);

// Lê o token e o aplica ao cliente
const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
oAuth2Client.setCredentials(token);

// Atualiza o token automaticamente se expirar
oAuth2Client.on('tokens', (tokens) => {
  if (tokens.refresh_token) {
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
  }
});

module.exports = oAuth2Client;