import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
    function AddTask({addTask}){
    const [name, setName] = useState("");
    const [status, setStatus] = useState("");

    const navigate = useNavigate();

        const handleSubmit = (event) => {
        event.preventDefault();

        const newTask = {
            id: Math.random(),
            name: name,
            status: status
        };

        addTask(newTask);

        navigate("/");
    };

        return(
            <div>
                <h1> Task Manager App</h1>
                <h2> Add Task</h2>
                <form class="basic-form" onSubmit={handleSubmit}>
                    <label> Task Name</label>
                    <input type="text" value={name} onChange={(event) => setName(event.target.value)}/>
                    <br/>
    <label> Task Status</label>
                    <input type="text" value={status} onChange={(event) => setStatus(event.target.value)}/>
                    <br/>
                    <button >Add Task </button>

                </form>
        </div>
        )

    }
    export default AddTask;