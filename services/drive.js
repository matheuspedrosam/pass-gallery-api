const { google } = require('googleapis');
const oAuth2Client = require('../auth/personal');

async function createFolder(name) {
  const drive = google.drive({ version: 'v3', auth: oAuth2Client });
  const res = await drive.files.create({
    requestBody: {
      name,
      mimeType: 'application/vnd.google-apps.folder'
    },
    fields: 'id, webViewLink'
  });
  return res.data;
}

module.exports = createFolder;