require("dotenv").config();

module.exports = class ClientController {
    
    static async createCliente(req, res){
        try{
            await this.callAsanaApi(req);
            await this.callDriveApi(req);
            await this.callMeetingApi(req);
            await this.callSheetsApi(req);
            return res.status(201).json({message: "Success!"});
        } catch (e){
            return res.status(500).json({error: "Failed"});
        } finally{

        }
    }

    static async callAsanaApi(req){
        const data = req.body;
        const { name, email, phone, meetingDate } = data;
        const asanaBaseUrlAPI = process.env.ASANA_BASE_URL_API;
    
        const response = await fetch(asanaBaseUrlAPI + '/tasks', {
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
                    notes: `Email: ${email}\nPhone: ${phone}\nMeeting Date: ${meetingDate.toLocaleDateString("pt-BR")}`,
                }
            })
        });
    
        if (!response.ok) {
            throw new Error('Failed to create Asana Task');
        }
    
        return response.json();
    }

    static async callDriveApi(req){
        return null;
    }

    static async callMeetingApi(req){
        return null;
    }

    static async callSheetsApi(req){
        return null;
    }
}