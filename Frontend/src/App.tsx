import React from 'react';
import './App.css';
import AllRoutes from './Components/All_Routes';
import Navbar from './Components/Navbar';

function App() {
  return (
    <div className="App">
      <Navbar />
      <AllRoutes />
    </div>
  );
}

export default App;