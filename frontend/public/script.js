const API_URL = 'http://localhost:5000/api/tasks';

// Cache elements
const elements = {
  form: document.getElementById('task-form'),
  title: document.getElementById('title'),
  desc: document.getElementById('description'),
  priority: document.getElementById('priority'),
  date: document.getElementById('dueDate'),
  list: document.getElementById('task-list'),
  submitBtn: document.querySelector('#task-form button')
};

let editingId = null;

// Helper: Standard Fetch Wrapper
const apiRequest = async (url, method = 'GET', body = null) => {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) options.body = JSON.stringify(body);
  
  try {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (e) {
    console.error("API Error:", e);
  }
};

const loadTasks = async () => {
  const tasks = await apiRequest(API_URL);
  if (tasks) renderTasks(tasks);
};

const renderTasks = (tasks) => {
  elements.list.innerHTML = '';
  tasks.forEach(task => {
    const isCompleted = task.status === 'completed';
    const li = document.createElement('li');
    li.className = `task-item ${isCompleted ? 'opacity-60' : ''}`;
    
    li.innerHTML = `
      <div class="task-content">
        <span class="badge ${task.priority}">${task.priority}</span>
        <h4 style="${isCompleted ? 'text-decoration: line-through' : ''}">${task.title}</h4>
        <p>${task.description}</p>
        <div class="task-meta">
          <span><i data-lucide="calendar"></i> ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</span>
          <span>• ${task.status}</span>
        </div>
      </div>
      <div class="task-actions">
        <button class="btn-icon" onclick="toggleStatus(${task.id}, '${task.status}')" title="Toggle Status">
          <i data-lucide="${isCompleted ? 'rotate-ccw' : 'check'}"></i>
        </button>
        <button class="btn-icon" onclick="editTask(${task.id})" title="Edit">
          <i data-lucide="edit-3"></i>
        </button>
        <button class="btn-icon text-red-500" onclick="deleteTask(${task.id})" title="Delete">
          <i data-lucide="trash-2"></i>
        </button>
      </div>
    `;
    elements.list.appendChild(li);
  });
  if (window.lucide) lucide.createIcons();
};

elements.form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const taskData = {
    title: elements.title.value,
    description: elements.desc.value,
    priority: elements.priority.value,
    dueDate: elements.date.value || null
  };

  if (editingId) {
    await apiRequest(`${API_URL}/${editingId}`, 'PUT', { ...taskData, status: 'pending' });
    editingId = null;
    elements.submitBtn.textContent = 'Add Task';
  } else {
    await apiRequest(API_URL, 'POST', taskData);
  }

  elements.form.reset();
  loadTasks();
});

window.editTask = async (id) => {
  // Better: Fetch just the single task
  const task = await apiRequest(`${API_URL}/${id}`);
  if (!task) return;

  elements.title.value = task.title;
  elements.desc.value = task.description;
  elements.priority.value = task.priority;
  elements.date.value = task.dueDate ? task.dueDate.split('T')[0] : '';
  
  editingId = task.id;
  elements.submitBtn.textContent = 'Update Task';
  elements.title.focus();
};

window.deleteTask = async (id) => {
  if (confirm('Delete this task?')) {
    await apiRequest(`${API_URL}/${id}`, 'DELETE');
    loadTasks();
  }
};

window.toggleStatus = async (id, currentStatus) => {
  const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
  // Optimization: Send a PATCH or PUT with only the status change
  await apiRequest(`${API_URL}/${id}`, 'PUT', { status: newStatus });
  loadTasks();
};

loadTasks();
