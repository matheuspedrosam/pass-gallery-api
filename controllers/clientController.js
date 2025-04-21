require("dotenv").config();

// Services
const { duplicateTask, updateTask } = require("../services/asana");
const { createMeeting } = require("../services/calendar");
const createFolder = require("../services/drive");
const sendEmail = require("../services/email");

module.exports = class ClientController {

    static async createCliente(req, res) {
        const data = req.body;
        try {
            // Calendar
            const calendarRes = await callCalendarApi(data);
            data['meetingLink'] = calendarRes.hangoutLink;

            // Gmail
            await callGmailApi(data);

            // Drive
            const driveRes = await callDriveApi(data);
            data['driveLink'] = driveRes.webViewLink;

            // Asana
            await callAsanaApi(data);

            // Complete
            return res.status(201).json({ message: "Success! Created tasks in asana, created folder in drive, meeting in calendar and send an email to the new client." });
        } catch (e) {
            console.error("Error occurred:", e);  // Adicionando mais detalhes ao erro
            return res.status(500).json({ error: e.message });
        }

        function addHours(date, hours = 1) {
            const newDate = new Date(date);
            newDate.setHours(newDate.getHours() + hours);
            return newDate;
        }

        async function callCalendarApi(data) {
            return await createMeeting({
                summary: `${data.name} Onboarding`,
                description: `Onboarding meeting Pass Gallery and ${data.name}`,
                startDateTime: new Date(data.meetingDate).toISOString(),
                endDateTime: new Date(addHours(data.meetingDate, 1)).toISOString(),
                attendees: [
                    { email: "matheuspedrosa2002@gmail.com" },
                    { email: data.email }
                ]
            });
        }

        async function callGmailApi(data) {
            return await sendEmail(data.email, "Welcome to Pass Gallery", `Hello ${data.name}. Welcome to Pass Gallery! 🎉\n\nHere's the meeting link: ${data.meetingLink}\n\nWe'll contact you soon.\n\nBest Regards,\nPass Gallery`);
        }

        async function callDriveApi(data) {
            return await createFolder(`${data.name} [Onboarding]`);
        }

        async function callAsanaApi(data) {
            const { name, email, phone, meetingDate } = data;
            const asanaTemplateNewClientTaskGID = "1210029710895033";
            const res = await duplicateTask(asanaTemplateNewClientTaskGID, name);
            const { data: job } = res;
            const newTaskGID = job.new_task.gid;
            const newData = {
                notes: `Ongoing Updates - add comments\n\nDiscovery Meeting Link:\n\nOnboarding Meeting Link: ${data.meetingLink}\n\nPass Recommended Pricing: ${data.driveLink} (not created Yet)\n\nWall Art Guide: (Canva)\n\nEmail: ${email}\n\nPhone: ${phone}\n\nMeeting Date: ${new Date(meetingDate).toLocaleDateString("en-US")}`,  // Corrigido formatação
                completed: false,
            }
            return await updateTask(newTaskGID, newData);
        }
    }
}
