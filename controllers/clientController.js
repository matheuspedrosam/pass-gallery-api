module.exports = class ClientController {
    
    static async createCliente(req, res){
        await this.callAsanaApi();
        await this.callDriveApi();
        await this.callMeetingApi();
        await this.callSheetsApi();
    }

    static async callAsanaApi(){
        const { name, email, phone, meetingDate } = data;
        const asanaBaseUrlAPI = import.meta.env.VITE_ASANA_BASE_URL_API;
    
        const response = await fetch(asanaBaseUrlAPI + '/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${import.meta.env.VITE_ASANA_ACCESS_TOKEN}`,
            },
            body: JSON.stringify({
                data: {
                    workspace: import.meta.env.VITE_ASANA_WORKSPACE_GID,
                    name: `${name} Onboarding`,
                    projects: [import.meta.env.VITE_ASANA_PROJECT_GID],
                    notes: `Email: ${email}\nPhone: ${phone}\nMeeting Date: ${meetingDate.toLocaleDateString("pt-BR")}`,
                }
            })
        });
    
        console.log(response);
    
        if (!response.ok) {
            throw new Error('Failed to submit the form');
        }
    
        return response.json();
    }
}