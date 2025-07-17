import React, { useState } from 'react';

function Login({ onLogin }) {
  const [form, setForm] = useState({ username: '', password: '' });

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch('http://127.0.0.1:8000/api/auth/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (response.ok) {
      const data = await response.json();
      onLogin(data.token);
    } else {
      const errorData = await response.json();
      alert(`Error en login: ${errorData.detail || 'Credenciales inválidas'}`);
    }
  } catch (error) {
    alert(`Error de red: ${error.message}`);
  }
};

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Usuario" value={form.username} onChange={e => setForm({...form, username: e.target.value})} />
      <input type="password" placeholder="Contraseña" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
      <button type="submit">Iniciar Sesión</button>
    </form>
  );
}



export default Login;