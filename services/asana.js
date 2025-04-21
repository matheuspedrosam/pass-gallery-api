require("dotenv").config();

const asanaBaseUrlAPI = process.env.ASANA_BASE_URL_API;

async function duplicateTask(taskGID, newName) {
    const response = await fetch(`${asanaBaseUrlAPI}/tasks/${taskGID}/duplicate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.ASANA_ACCESS_TOKEN}`,
        },
        body: JSON.stringify({
            data: {
                name: `${newName} [Onboarding]`,
                include: "assignee,attachments,dates,dependencies,tags,followers,notes,parent,projects,subtasks"
            }
        })
    });
    
    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Asana API error on duplicating: ${response.status} - ${errText}`);
    }

    return response.json();
}

async function updateTask(taskGID, data) {
    const response = await fetch(`${asanaBaseUrlAPI}/tasks/${taskGID}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.ASANA_ACCESS_TOKEN}`,
        },
        body: JSON.stringify({data})
    });
    
    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Asana API error on updating: ${response.status} - ${errText}`);
    }
    
    return response.json();
}



module.exports = {duplicateTask, updateTask}