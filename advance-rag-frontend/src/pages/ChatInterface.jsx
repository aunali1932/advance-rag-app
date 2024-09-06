import React, { useState, useEffect } from 'react';
import './ChatInterface.css';

const ChatInterface = () => {
  const [ragApproaches, setRagApproaches] = useState([]);
  const [selectedRag, setSelectedRag] = useState('');
  const [apiKey, setApiKey] = useState(''); // API key input value
  const [isApiKeySet, setIsApiKeySet] = useState(false); // Tracks whether API key is set
  const [pdfFile, setPdfFile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar state
  const [showWarning, setShowWarning] = useState(false); // Warning box state

  // Fetch RAG approaches from the external JSON file
  useEffect(() => {
    fetch('/files/ragApproaches.json')
      .then(response => response.json())
      .then(data => setRagApproaches(data.approaches))
      .catch(err => console.error('Error loading RAG approaches:', err));
  }, []);

  // Trigger the warning box to slide down after the page loads
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWarning(true); // Show warning box after a short delay
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleApiKeyChange = (e) => {
    setApiKey(e.target.value);
  };

  const handleSetApiKey = () => {
    // Simulate API call to set the API key
    // You will replace this with the actual backend call later
    console.log('API key set:', apiKey);
    setIsApiKeySet(true); // Mark the API key as set
  };

  
  const handleResetApiKey = () => {
    // Simulate resetting the API key
    console.log('API key reset');
    setApiKey(''); // Clear the API key
    setIsApiKeySet(false); // Mark the API key as not set
  };

  const handlePdfUpload = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;

    const userMessage = { sender: 'User', text: inputMessage };
    setMessages(prev => [...prev, userMessage]);

    fetch('/api/send-query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({ query: inputMessage, pdfFile, ragApproach: selectedRag })
    })
      .then(response => response.json())
      .then(data => {
        const botMessage = { sender: 'Bot', text: data.response };
        setMessages(prev => [...prev, botMessage]);
      })
      .catch(err => console.error('Error sending message:', err));

    setInputMessage('');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar visibility
  };

  const closeWarning = () => {
    setShowWarning(false); // Close the warning box
  };

  return (
    <div className="chat-interface">
      {/* Warning Box */}
      <div className={`warning-box ${showWarning ? 'show' : ''}`}>
        <span>Some of the RAG Approaches might be a little costly. Kindly read the workflow after selecting the approach.</span>
        <button className="close-btn" onClick={closeWarning}>×</button>
      </div>

      <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <button className="hamburger" onClick={toggleSidebar}>
          &#9776;
        </button>
        {isSidebarOpen && (
          <div className="sidebar-content">
            <h3>Select RAG Approach</h3>
            <select
              value={selectedRag}
              onChange={(e) => setSelectedRag(e.target.value)}
              className="rag-dropdown"
            >
              <option value="" disabled>Select a RAG approach</option>
              {ragApproaches.map((approach, index) => (
                <option key={index} value={approach}>{approach}</option>
              ))}
            </select>

            {/* Conditionally render API Key input or Reset button */}
            {isApiKeySet ? (
              <button onClick={handleResetApiKey} className="reset-api-btn">Reset API Key</button>
            ) : (
              <div className="api-input-section">
                <input
                  type="text"
                  placeholder="Enter OpenAI API Key"
                  value={apiKey}
                  onChange={handleApiKeyChange}
                  className="api-input"
                />
                <button onClick={handleSetApiKey} className="set-api-btn">Set</button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="main-content">
        {/* Display instruction when no RAG approach or API key is set */}
        {!selectedRag || !isApiKeySet ? (
          <div className="instruction">
            <h2>Select your desired RAG Approach and set an API key to start</h2>
          </div>
        ) : pdfFile ? (
          <div className="chat-window">
            <div className="chat-messages">
              {messages.map((message, index) => (
                <div key={index} className={`message ${message.sender}`}>
                  <span className="message-text">{message.text}</span>
                </div>
              ))}
            </div>

            <div className="chat-input">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
              />
              <button onClick={handleSendMessage}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
              </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="pdf-upload-section">
            <h3>Upload your PDF to continue</h3>
            <input type="file" onChange={handlePdfUpload} className="pdf-upload" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
