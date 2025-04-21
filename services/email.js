const { google } = require('googleapis');
const oAuth2Client = require('../auth/personal.js');

async function sendEmail(to, subject, message) {
  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
  const rawMessage = Buffer.from(
    `To: ${to}\nSubject: ${subject}\nContent-Type: text/plain; charset=utf-8\n\n${message}`
  ).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw: rawMessage }
  });
}

module.exports = sendEmail;