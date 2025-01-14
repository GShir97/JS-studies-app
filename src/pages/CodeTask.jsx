import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from "socket.io-client";
import CodeMirror from '@uiw/react-codemirror'; 
import { javascript } from '@codemirror/lang-javascript'; 
import './CodeTask.css';

const socket = io("https://js-studies-app.onrender.com");

function CodeTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [code, setCode] = useState(''); 
  const [solution, setSolution] = useState('');
  const [success, setSuccess] = useState(false);
  const [role, setRole] = useState(null);
  const [viewers, setViewers] = useState(0);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to socket server, ID:", socket.id);
    });

    const fetchCodeBlock = async () => {
      try {
        const response = await fetch(`https://js-studies-app.onrender.com/api/tasks/${id}`);
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

    socket.emit("joinTask", { taskId: id });

    socket.on("role", (serverRole) => {
      setRole(serverRole);
    });

    socket.on("updateViewers", (viewersCount) => {
      setViewers(viewersCount);
    });

    socket.on("codeUpdated", (updatedCode) => {
      setCode(updatedCode);
    });

    socket.on("redirectToLobby", () => {
      navigate("/");
    });

    return () => {
      socket.disconnect();
    };
  }, [id, navigate]);
  

  const handleChange = (value) => {
    const cleanValue = value.trim().replace(/\s+/g, " ");
    const cleanSolution = solution.trim().replace(/\s+/g, " ");

    setCode(value);

    if (cleanValue === cleanSolution) {
      setSuccess(true);
      console.log("Correct solution!");
    } else {
      setSuccess(false);
      console.log("Incorrect solution!");
    }
      if (role === "student") {
        setCode(value);
        socket.emit("updateCode", { id, code: value });
      }
  };

  return (
    <div className="code-task-container">
      {task ? (
        <>
          <div className="task-header">
            <h1>{task.name}</h1>
            <h3>Number of viewers: {viewers}</h3>
            <h4>Role: {role === "mentor" ? "Mentor" : "Student"}</h4>
          </div>
          <div className="code-editor-container">
            <CodeMirror
              value={code}
              height="500px"
              extensions={[javascript()]}
              theme="dark"
              onChange={handleChange}
              editable={role !== "mentor"}
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
