import React, { useState } from 'react';
import Login from './components/login';
import Register from './components/register';
import HomePage from './HomePage';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="app">
      <header><h1>Viaja Fácil</h1></header>
      <main>
        {!isLoggedIn ? (
          <>
            <Login onLogin={(token) => setIsLoggedIn(true)} />
            <Register onRegister={() => alert('Registro exitoso, inicia sesión')} />
          </>
        ) : (
          <HomePage />
        )}
      </main>
    </div>
  );
}

export default App;