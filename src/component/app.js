import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TaskDashboard from './components/taskdashboard';
import AddTask from './components/addtask';
import { useState } from "react";

function App() {
  const [tasks, setTasks] = useState([
        { id:1, name: "Learn HTML", status: "Completed" },
        { id:2, name: "Learn CSS", status: "InProgress" }
    ]);

    const addTask = (newTask) => {
        setTasks([...tasks, newTask]);
    };
    const deleteTask = (id) => {
  const updated = tasks.filter(task => task.id !== id);
  setTasks(updated);
};

  return (
    <div className="App">
     <BrowserRouter>
        <Routes>
          <Route path="/" element={<TaskDashboard tasks={tasks} deleteTask={deleteTask} />} ></Route>
        <Route path="/addtask" element={<AddTask addTask={addTask}  />}></Route>
       
        </Routes>
     </BrowserRouter>
         </div>
  );
}

export default App;