import React, { useEffect, useState} from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");

  const loadTasks = async () => {
    const res = await fetch("http://localhost:15000/tasks");
    setTasks(await res.json());
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const addTasks = async () => {
    await fetch("http://localhost:15000/tasks", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({text, completed: false})
    });
    setText("");
    loadTasks();
  }

  const toggleTasks = async (task) => {
    await fetch(`http://localhost:15000/tasks/${task._id}`,{
      method: "PUT",
      headers: {"Contenet-Type": "application/json"},
      body: JSON.stringify({...task, completed: !task.completed})
    });
    loadTasks();
  };

  const deleteTask = async (id) => {
    await fetch(`http://localhost:15000/tasks/${id}`, {method:"DELETE"});
    loadTasks();
  }

  return (
    <div style={{padding: 20}}>
      <h1>📝 To-Do App Version 1.0</h1>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={addTasks}>Add</button>
      <ul>
        {tasks.map(task => (
          <li key={task._id}>
            <input type="checkbox" checked={task.completed} onChange={() => toggleTasks(task)} />
            {task.text}
            <button onClick={() => deleteTask(task._id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;