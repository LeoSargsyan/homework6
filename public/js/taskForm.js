document.getElementById('taskForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const taskData = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        date: document.getElementById('date').value,
    };

    console.log(taskData);

    try {
        const response = await fetch('/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error from server:', errorData);
        }

        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error creating task:', error);
    }
});


