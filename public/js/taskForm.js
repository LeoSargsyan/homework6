document.getElementById('taskForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const taskData = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        date: document.getElementById('date').value,
    };


    console.log('Sending data:', taskData);

    try {
        const response = await fetch('/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('server error:', data);
        } else {
            console.log('Task successfully created:', data);
        }
    } catch (error) {
        console.error("Error creating task:", error);
    }
});

