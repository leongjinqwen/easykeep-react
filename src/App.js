import React, { useState } from 'react';
import './App.css';
import { ToastContainer } from 'react-toastify';
import NavBar from './components/NavBar';

function App() {
  const [currentUser,setCurrentUser] = useState(JSON.parse(localStorage.getItem('user')))

  return (
    <>
      <ToastContainer />
      <NavBar currentUser={currentUser} setCurrentUser={setCurrentUser} />
    </>
  );
}

export default App;
