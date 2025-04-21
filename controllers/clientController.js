require("dotenv").config();

module.exports = class ClientController {

    static async createCliente(req, res) {
        try {
            await callAsanaApi(req);
            await callDriveApi(req);
            await callMeetingApi(req);
            await callSheetsApi(req);
            return res.status(201).json({ message: "Success!" });
        } catch (e) {
            console.error(e);
            return res.status(500).json({ error: e.message });
        } finally {
        }

        async function callAsanaApi(req) {
            const data = await req.body;
            console.log(data);
            const { name, email, phone, meetingDate } = data;
            const asanaBaseUrlAPI = process.env.ASANA_BASE_URL_API;

            const response = await fetch(`${asanaBaseUrlAPI}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.ASANA_ACCESS_TOKEN}`,
                },
                body: JSON.stringify({
                    data: {
                        workspace: process.env.ASANA_WORKSPACE_GID,
                        name: `${name} Onboarding`,
                        projects: [process.env.ASANA_PROJECT_GID],
                        notes: `Email: ${email}\nPhone: ${phone}\nMeeting Date: ${new Date(meetingDate).toLocaleDateString("en")}`,
                    }
                })
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`Asana API error: ${response.status} - ${errText}`);
            }

            return response.json();
        }


        async function callDriveApi(req) {
            return null;
        }

        async function callMeetingApi(req) {
            return null;
        }

        async function callSheetsApi(req) {
            return null;
        }
    }
}