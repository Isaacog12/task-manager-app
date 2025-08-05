const API_URL = 'http://localhost:5000/api/tasks';

const form = document.getElementById('task-form');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const priorityInput = document.getElementById('priority');
const dueDateInput = document.getElementById('dueDate');
const taskList = document.getElementById('task-list');

let editingId = null;

const loadTasks = async () => {
  const res = await fetch(API_URL);
  const tasks = await res.json();
  renderTasks(tasks);
};

const renderTasks = (tasks) => {
  taskList.innerHTML = '';
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="task-header">
        <strong>${task.title}</strong>
        <div class="task-actions">
          <button onclick="editTask(${task.id})">Edit</button>
          <button onclick="deleteTask(${task.id})">Delete</button>
          <button onclick="toggleStatus(${task.id}, '${task.status}')">
            Mark as ${task.status === 'completed' ? 'Pending' : 'Completed'}
          </button>
        </div>
      </div>
      <p>${task.description}</p>
      <small>Priority: ${task.priority}</small><br/>
      <small>Status: ${task.status}</small><br/>
      <small>Due: ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</small>
    `;
    taskList.appendChild(li);
  });
};

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const newTask = {
    title: titleInput.value,
    description: descriptionInput.value,
    priority: priorityInput.value,
    dueDate: dueDateInput.value || null
  };

  if (editingId) {
    await fetch(`${API_URL}/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newTask, status: 'pending' })
    });
    editingId = null;
  } else {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask)
    });
  }

  form.reset();
  loadTasks();
});

window.editTask = async (id) => {
  const res = await fetch(`${API_URL}`);
  const tasks = await res.json();
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  titleInput.value = task.title;
  descriptionInput.value = task.description;
  priorityInput.value = task.priority;
  dueDateInput.value = task.dueDate ? task.dueDate.split('T')[0] : '';
  editingId = task.id;
};

window.deleteTask = async (id) => {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  loadTasks();
};

window.toggleStatus = async (id, currentStatus) => {
  const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
  const res = await fetch(`${API_URL}`);
  const tasks = await res.json();
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...task, status: newStatus })
  });

  loadTasks();
};

loadTasks();
