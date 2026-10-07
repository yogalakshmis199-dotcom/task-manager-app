const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, "data", "tasks.json");
const PRIORITIES = ["High", "Medium", "Low"];

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ---------- Helpers ----------
function readTasks() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch (e) {
    return [];
  }
}

function writeTasks(tasks) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
}

// ---------- API routes ----------

// Get all tasks
app.get("/api/tasks", (req, res) => {
  res.json(readTasks());
});

// Add a task
app.post("/api/tasks", (req, res) => {
  const { title, priority, due } = req.body;

  if (typeof title !== "string" || !title.trim()) {
    return res.status(400).json({ error: "Enter a task name to add it." });
  }

  const task = {
    id: Date.now(),
    title: title.trim().slice(0, 120),
    priority: PRIORITIES.includes(priority) ? priority : "Medium",
    due: typeof due === "string" ? due : "",
    done: false
  };

  const tasks = readTasks();
  tasks.unshift(task);
  writeTasks(tasks);
  res.status(201).json(task);
});

// Clear all completed tasks (must be BEFORE the /:id route)
app.delete("/api/tasks/completed", (req, res) => {
  const tasks = readTasks().filter(t => !t.done);
  writeTasks(tasks);
  res.json({ success: true });
});

// Update a task (edit or mark done)
app.put("/api/tasks/:id", (req, res) => {
  const tasks = readTasks();
  const task = tasks.find(t => t.id === Number(req.params.id));

  if (!task) return res.status(404).json({ error: "Task not found." });

  const { title, priority, due, done } = req.body;

  if (title !== undefined) {
    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ error: "Enter a task name to add it." });
    }
    task.title = title.trim().slice(0, 120);
  }
  if (PRIORITIES.includes(priority)) task.priority = priority;
  if (typeof due === "string") task.due = due;
  if (typeof done === "boolean") task.done = done;

  writeTasks(tasks);
  res.json(task);
});

// Delete one task
app.delete("/api/tasks/:id", (req, res) => {
  const tasks = readTasks();
  const remaining = tasks.filter(t => t.id !== Number(req.params.id));

  if (remaining.length === tasks.length) {
    return res.status(404).json({ error: "Task not found." });
  }

  writeTasks(remaining);
  res.json({ success: true });
});

// ---------- Start server ----------
app.listen(PORT, () => {
  console.log("Task Manager running at http://localhost:" + PORT);
});