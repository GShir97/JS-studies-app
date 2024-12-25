import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import  CodeMirror from '@uiw/react-codemirror'; 
import { javascript } from '@codemirror/lang-javascript'; 
import './CodeTask.css'

function CodeTask() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [code, setCode] = useState(''); 
  const [solution, setSolution] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchCodeBlock = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/tasks/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTask(data);
        setCode(data.code);
        setSolution(data.solution);
      } catch (error) {
        console.error('Error fetching code block:', error.message);
      }
    };

    fetchCodeBlock();
  }, [id]);

  const handleChange = (value) => {
    setCode(value);
    if (value.trim() === solution.trim()) {
      setSuccess(true);
    } else {
      setSuccess(false);
    }
  };

  return (
    <div className="code-task-container">
      {task ? (
        <>
          <div className="task-header">
            <h1>{task.name}</h1>
            <h3>Number of viewers: {task.usersCount}</h3>
          </div>
          <div className="code-editor-container">
            <CodeMirror
              value={code}
              height="500px"
              extensions={[javascript()]}
              theme="dark"
              onChange={handleChange}
            />
            {success && (
              <div className="success-message">
                <img
                  src="/Smiley.png"
                  alt="Smiley face"
                />
                <p>Great Job!</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <p>Loading task data...</p>
      )}
    </div>
  );
  
}

export default CodeTask;
