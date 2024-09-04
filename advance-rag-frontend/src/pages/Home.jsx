// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home">
        <div className='heading'>
      <h2>Advanced RAG Playground</h2>
      </div>
      <div className='textdiv'>
      <p className='txt'>This app lets you explore and compare over 15 advanced RAG techniques to find what works best for you.</p>
      </div>
      <div className="buttons">
        <Link to="/chat" className="btn">Test</Link>
        
      </div>
    </div>
  );
}

export default Home;
