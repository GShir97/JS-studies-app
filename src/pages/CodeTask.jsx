import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

function CodeTask() {
  const { id } = useParams();
  console.log('Fetched ID from URL:', id);
  const [codeBlock, setCodeBlock] = useState(null);
  const [editorText, setEditorText] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchCodeBlock = async () => {
      try {
        console.log('Sending request to:', `http://localhost:3000/api/tasks/${id}`);
        const response = await fetch(`http://localhost:3000/api/tasks/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCodeBlock(data);
        setEditorText(data.code || '');
      } catch (error) {
        console.error('Error fetching code block:', error);
      }
    };
    fetchCodeBlock();
  }, [id]);

  useEffect(() => {
    if (codeBlock && editorText === codeBlock.solution) {
      setSuccess(true);
    } else {
      setSuccess(false);
    }
  }, [editorText, codeBlock]);

  return (
    <div style={{ textAlign: 'center', margin: '20px' }}>
      <h1>{codeBlock?.name || 'Loading...'}</h1>
      <p>Number of users in this page: {codeBlock?.usersCount || 0}</p>
      <div style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '5px' }}>
        <textarea
          value={editorText}
          onChange={(e) => setEditorText(e.target.value)}
          style={{
            width: '100%',
            height: '300px',
            fontFamily: 'monospace',
            fontSize: '14px',
          }}
        />
        <SyntaxHighlighter language="javascript" style={docco}>
          {editorText}
        </SyntaxHighlighter>
      </div>
      {success && (
        <div style={{ marginTop: '20px' }}>
          <img
            src="/Smiley.png"
            alt="Smiley face"
            style={{ width: '150px', height: '150px' }}
          />
          <p style={{ color: 'green', fontSize: '20px' }}>You solved it!</p>
        </div>
      )}
    </div>
  );
}

export default CodeTask;
