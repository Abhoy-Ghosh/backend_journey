// Import Node.js built-in File System module
// WHY: We need this to read and write tasks to a file (tasks.json)
const fs = require('fs')

// Define the path of our data file
// WHY: Centralizing the file path makes the code cleaner and easier to update
const filePath = "./tasks.json";

// ----------------------
// Function: loadTasks()
// ----------------------
const loadTasks = () =>{
    try {
        // Read the file synchronously
        // WHY: We want the tasks immediately, no callbacks or promises
        const dataBuffer = fs.readFileSync(filePath)

        // Convert binary file data to text
        // WHY: JSON.parse only works on strings, not buffers
        const dataJSON = dataBuffer.toString()

        // Parse JSON string into a JS array/object
        // WHY: We want to work with tasks as normal JS objects
        return JSON.parse(dataJSON)
    } catch(error) {
        // If file doesn't exist or is corrupted, return empty list
        // WHY: This prevents crashes when the program runs the first time
        return []
    }
}

// ----------------------
// Function: saveTasks()
// ----------------------
const saveTasks = (tasks) => {
    // Convert JS array/object to JSON string
    // WHY: Only strings can be written to files
    const dataJSON = JSON.stringify(tasks, null, 2)

    // Write JSON string to tasks.json
    // WHY: This saves our tasks permanently
    fs.writeFileSync(filePath, dataJSON)
}

// ----------------------
// Function: addTask()
// ----------------------
const addTask =(task) =>{
    // Load existing tasks
    // WHY: So we don’t overwrite old tasks when adding a new one
    const tasks = loadTasks()

    // Add a new task object with a "task" property
    // WHY: Using an object lets us expand later (e.g., {task, done: false})
    tasks.push({task});

    // Save the updated task list back to file
    // WHY: Persist the new task
    saveTasks(tasks)

    // Give user feedback in terminal
    // WHY: User needs confirmation that task was added
    console.log("Task Added", task);
}

// ----------------------
// Function: listTasks()
// ----------------------
const listTasks =  () => {
    // Load all saved tasks
    // WHY: We want to display the most up-to-date list
    const tasks = loadTasks();

    // Loop through tasks and print them with numbering
    // WHY: Numbering helps users refer to tasks when removing
    tasks.forEach((task, index) =>
        console.log(`${index + 1} - ${task.task}`)
    )
}

// ----------------------
// Function: removeTask()
// ----------------------
const removeTask = (index) => {
    // Load current tasks
    let tasks = loadTasks();

    // Validate index is within range
    // WHY: Prevents errors from removing non-existent tasks
    if (index < 1 || index > tasks.length) {
        console.log("⚠️ Invalid task number.");
        return;
    }

    // Remove one task (arrays are 0-based, so subtract 1)
    // WHY: This updates the task list correctly
    const removed = tasks.splice(index - 1, 1);

    // Save updated list to file
    saveTasks(tasks);

    // Confirm removal to the user
    console.log("🗑️ Task Removed:", removed[0].task);
}

// ----------------------
// CLI Argument Handling
// ----------------------

// Capture the first command-line argument (e.g. "add", "list", "remove")
// WHY: This decides which action the program should perform
const command = process.argv[2]

// Capture the second command-line argument (e.g. "buy books", or "1")
// WHY: This provides extra info needed by the command
const argument = process.argv[3]

// Route the command to the correct function
// WHY: This acts like the "controller" of our app
if (command === 'add'){
    addTask(argument);           // Add a task with given description
} else if (command === 'list') {
    listTasks();                 // List all tasks
} else if (command === 'remove') {
    removeTask(parseInt(argument)); // Remove a task by number
} else {
    console.log("command not found !"); // Fallback for unknown commands
}

// [ User Command (terminal) ]
//         │
//         ▼
//  process.argv[2]  → command (e.g. "add", "list", "remove")
//  process.argv[3]  → argument (e.g. "buy milk" or 2)
//         │
//         ▼
//    ┌───────────────┐
//    │   if / else    │   ← "traffic controller"
//    └───────────────┘
//         │
//    ┌────┴─────┬──────────┬───────────┐
//    ▼          ▼          ▼
//  addTask()  listTasks()  removeTask()
//    │          │             │
//    ▼          │             │
// loadTasks()   │          loadTasks()
//    │          │             │
//    ▼          ▼             ▼
//  Reads tasks  Prints     Reads tasks
//  from file    tasks      from file
//    │                        │
//    ▼                        ▼
//  (array of tasks in memory) ───► splice (remove one)
//    │                        │
//    ▼                        ▼
//  push new task              saveTasks()
//    │                        │
//    ▼                        │
//  saveTasks()  ◄─────────────┘
//    │
//    ▼
//  Writes updated tasks back into `tasks.json`

