import { useNavigate } from 'react-router-dom';

function TaskDashboard({tasks,deleteTask}){
     const navigate = useNavigate();

    const showAddTask = () =>{
        navigate("/addtask");
    }
    return(
        <div>
            <h1> Task Manager App</h1>
            <h2> TaskDashboard</h2>
            <table>
                <thead>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Action</th>
                </thead>
                <tbody>
                    {tasks.map((task,index)=>(
                        <tr key={index}>
                            <td>{task.name}</td>
                            <td>{task.status}</td>
                            <td><button onClick={() => deleteTask(task.id)}>Delete</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button class="my-button" onClick={showAddTask} >Add Task</button>
        </div>

    );

}
export default TaskDashboard;