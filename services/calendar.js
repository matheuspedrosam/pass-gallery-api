const { google } = require('googleapis');
const oAuth2Client = require("../auth/personal.js");

async function createMeeting({ summary, description, startDateTime, endDateTime, attendees }) {
  const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

  const res = await calendar.events.insert({
    calendarId: 'primary',
    conferenceDataVersion: 1,
    requestBody: {
      summary,
      description,
      start: { dateTime: startDateTime },
      end: { dateTime: endDateTime },
      attendees,
      conferenceData: {
        createRequest: {
          requestId: `meet-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' }
        }
      }
    }
  });
  return res.data;
}


async function verifyAvailableMeetingDates(params){
    //TODO
    return res.json({message: "TODO"});
}

module.exports = {createMeeting, verifyAvailableMeetingDates};