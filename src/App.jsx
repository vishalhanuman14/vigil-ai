import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './Landing';
import Home from './Home';
import Configure from './Configure';

function App() {
  return (
    <div className="w-screen h-screen bg-qualcomm-gray">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/configure" element={<Configure />} />
      </Routes>
    </div>
  );
}

export default App;