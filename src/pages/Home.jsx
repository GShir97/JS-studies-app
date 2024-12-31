import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';


function Home() {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
          try {
            const response = await fetch('https://js-studies-app.onrender.com/api/tasks');
            const data = await response.json();
            console.log('Fetched tasks:', data);
            setTasks(data);
            console.log(tasks)
          } catch (error) {
              console.error('Error fetching tasks:', error)
            }
        };

        fetchTasks();

    }, []);
    
    return (
      <div>
        <div className="header-container"> 
          <h1>Choose code block</h1> 
        </div>
        <div className='links-container'>
          <ul>
          {tasks.map(task => (
              <li key={task._id}>
                <Link to={`/codetask/${task._id}`}>{task.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
}

export default Home;