// =============================================
// STEP 1 – CONNECT TO THE HTML ELEMENTS
// document.getElementById finds an element by
// the id="..." you gave it in the HTML file.
// =============================================
const taskInput  = document.getElementById('taskInput');
const addBtn     = document.getElementById('addBtn');
const taskList   = document.getElementById('taskList');
const summary    = document.getElementById('summary');
const emptyState = document.getElementById('emptyState');


// =============================================
// STEP 2 – DATA
// 'tasks' is an array (a list) of task objects.
// Each task object looks like:
//   { id: 1718000000000, text: "Buy milk", done: false }
// We load any saved tasks from localStorage first,
// or start with an empty array if there are none.
// =============================================
let tasks = loadTasksFromStorage();


// =============================================
// STEP 3 – RENDER
// This function rebuilds the visible task list
// from scratch every time the data changes.
// It is the single source of truth for what
// the user sees.
// =============================================
function render() {
  // Clear the current list
  taskList.innerHTML = '';

  if (tasks.length === 0) {
    // No tasks – show the empty state message
    emptyState.style.display = 'block';
    summary.textContent = '';
  } else {
    emptyState.style.display = 'none';

    // Count how many tasks are not yet done
    const remaining = tasks.filter(task => !task.done).length;
    summary.textContent =
      remaining === 0
        ? '🎉 All tasks complete!'
        : `${remaining} of ${tasks.length} task${tasks.length > 1 ? 's' : ''} remaining`;

    // Build one <li> element for each task
    tasks.forEach(task => {
      // Create the list item
      const li = document.createElement('li');
      li.className = 'task-item' + (task.done ? ' done' : '');

      // Create the checkbox
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.done;
      // When checkbox is toggled, call toggleTask with this task's id
      checkbox.addEventListener('change', () => toggleTask(task.id));

      // Create the label (the task text)
      const label = document.createElement('label');
      label.className = 'task-label';
      label.textContent = task.text;
      // Clicking the label also toggles the task
      label.addEventListener('click', () => toggleTask(task.id));

      // Create the delete button
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-btn';
      deleteBtn.textContent = '✕';
      deleteBtn.title = 'Delete task';
      deleteBtn.setAttribute('aria-label', `Delete task: ${task.text}`);
      // When clicked, call deleteTask with this task's id
      deleteBtn.addEventListener('click', () => deleteTask(task.id));

      // Assemble: put checkbox, label, and delete button inside the <li>
      li.appendChild(checkbox);
      li.appendChild(label);
      li.appendChild(deleteBtn);

      // Add the <li> to the <ul>
      taskList.appendChild(li);
    });
  }
}


// =============================================
// STEP 4 – ADD A TASK
// Reads the input field, creates a new task
// object, adds it to the array, saves, and
// re-renders the list.
// =============================================
function addTask() {
  // .trim() removes accidental leading/trailing spaces
  const text = taskInput.value.trim();

  if (text === '') {
    // Don't add an empty task – shake the input as feedback
    taskInput.classList.add('shake');
    taskInput.addEventListener('animationend', () => {
      taskInput.classList.remove('shake');
    }, { once: true });
    return; // stop the function here
  }

  // Build a new task object
  const newTask = {
    id:   Date.now(), // unique number based on current timestamp
    text: text,
    done: false
  };

  tasks.push(newTask);  // add it to our array
  saveTasksToStorage(); // persist to localStorage
  render();             // update the screen

  // Clear the input and return focus so the user can type again
  taskInput.value = '';
  taskInput.focus();
}


// =============================================
// STEP 5 – TOGGLE A TASK (complete / incomplete)
// Finds the task by id and flips its done value.
// =============================================
function toggleTask(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, done: !task.done } : task
    // { ...task, done: !task.done } means:
    // "copy all properties of task, but set done to its opposite"
  );
  saveTasksToStorage();
  render();
}


// =============================================
// STEP 6 – DELETE A TASK
// Keeps every task EXCEPT the one with this id.
// =============================================
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasksToStorage();
  render();
}


// =============================================
// STEP 7 – LOCAL STORAGE
// JSON.stringify converts the array to a string
// for storage. JSON.parse converts it back.
// =============================================
function saveTasksToStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasksFromStorage() {
  const stored = localStorage.getItem('tasks');
  // If nothing is stored yet, return an empty array
  return stored ? JSON.parse(stored) : [];
}


// =============================================
// STEP 8 – EVENT LISTENERS
// These tell the browser what to do when the
// user interacts with the page.
// =============================================

// Click the Add button → addTask()
addBtn.addEventListener('click', addTask);

// Press Enter in the input field → addTask()
taskInput.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    addTask();
  }
});


// =============================================
// STEP 9 – INITIAL RENDER
// Run render() once when the page first loads
// so saved tasks appear immediately.
// =============================================
render();
