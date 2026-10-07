// ---------- State ----------
const API = "/api/tasks";
let tasks = [];
let filter = "all";
let editingId = null;

// ---------- Elements ----------
const form = document.getElementById("taskForm");
const titleEl = document.getElementById("title");
const priorityEl = document.getElementById("priority");
const dueEl = document.getElementById("due");
const errEl = document.getElementById("err");
const addBtn = document.getElementById("addBtn");
const listEl = document.getElementById("list");
const countEl = document.getElementById("count");

// ---------- Talk to the server ----------
async function api(url, method = "GET", body) {
  const res = await fetch(url, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Something went wrong. Try again.");
  return data;
}

async function loadTasks() {
  try {
    tasks = await api(API);
    render();
  } catch (err) {
    errEl.textContent = "Cannot reach the server. Is it running?";
  }
}

// ---------- Add / Update ----------
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = titleEl.value.trim();

  if (!title) {
    errEl.textContent = "Enter a task name to add it.";
    return;
  }
  errEl.textContent = "";

  const payload = { title: title, priority: priorityEl.value, due: dueEl.value };

  try {
    if (editingId) {
      await api(API + "/" + editingId, "PUT", payload);
      editingId = null;
      addBtn.textContent = "Add task";
    } else {
      await api(API, "POST", payload);
    }
    form.reset();
    priorityEl.value = "Medium";
    await loadTasks();
  } catch (err) {
    errEl.textContent = err.message;
  }
});

// ---------- Actions ----------
async function toggle(id, done) {
  try {
    await api(API + "/" + id, "PUT", { done: done });
    await loadTasks();
  } catch (err) {
    errEl.textContent = err.message;
  }
}

async function remove(id) {
  try {
    await api(API + "/" + id, "DELETE");
    if (editingId === id) {
      editingId = null;
      form.reset();
      addBtn.textContent = "Add task";
    }
    await loadTasks();
  } catch (err) {
    errEl.textContent = err.message;
  }
}

function edit(id) {
  const t = tasks.find(t => t.id === id);
  editingId = id;
  titleEl.value = t.title;
  priorityEl.value = t.priority;
  dueEl.value = t.due;
  addBtn.textContent = "Save changes";
  titleEl.focus();
}

document.getElementById("clearDone").addEventListener("click", async () => {
  try {
    await api(API + "/completed", "DELETE");
    await loadTasks();
  } catch (err) {
    errEl.textContent = err.message;
  }
});

document.getElementById("tabs").addEventListener("click", (e) => {
  const btn = e.target.closest(".tab");
  if (!btn) return;
  filter = btn.dataset.f;
  document.querySelectorAll(".tab").forEach(b => {
    b.setAttribute("aria-pressed", b === btn);
  });
  render();
});

// ---------- Render ----------
function render() {
  const shown = tasks.filter(t =>
    filter === "all" ? true : filter === "done" ? t.done : !t.done
  );

  listEl.innerHTML = "";

  if (shown.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = filter === "done"
      ? "No completed tasks yet."
      : "No tasks here. Add one above to get started.";
    listEl.appendChild(empty);
  }

  const today = new Date().toISOString().slice(0, 10);

  shown.forEach(t => {
    const li = document.createElement("li");
    li.className = t.priority + (t.done ? " done" : "");

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = t.done;
    cb.setAttribute("aria-label", "Mark " + t.title + " as done");
    cb.addEventListener("change", () => toggle(t.id, cb.checked));

    const body = document.createElement("div");
    body.className = "body";

    const title = document.createElement("div");
    title.className = "title";
    title.textContent = t.title;

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent = t.priority + " priority";

    if (t.due) {
      meta.textContent += " · Due " + t.due;
      if (!t.done && t.due < today) {
        const late = document.createElement("span");
        late.className = "late";
        late.textContent = " (overdue)";
        meta.appendChild(late);
      }
    }
    body.append(title, meta);

    const editBtn = document.createElement("button");
    editBtn.className = "icon";
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => edit(t.id));

    const delBtn = document.createElement("button");
    delBtn.className = "icon del";
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", () => remove(t.id));

    li.append(cb, body, editBtn, delBtn);
    listEl.appendChild(li);
  });

  const left = tasks.filter(t => !t.done).length;
  countEl.textContent = left + (left === 1 ? " task left" : " tasks left");
}

// ---------- Start ----------
loadTasks();