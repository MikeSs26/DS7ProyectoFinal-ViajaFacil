import React, { useState } from 'react';

function Register({ onRegister }) {
  const [form, setForm] = useState({ username: '', email: '', password: '', phone: '' });

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch('http://127.0.0.1:8000/api/auth/register/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (response.ok) onRegister();
    else {
      const errorData = await response.json();
      alert(`Error en registro: ${errorData.detail || 'Datos inválidos'}`);
    }   
  } catch (error) {
    alert(`Error de red: ${error.message}`);
  }
};

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Usuario" value={form.username} onChange={e => setForm({...form, username: e.target.value})} />
      <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
      <input type="password" placeholder="Contraseña" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
      <input type="text" placeholder="Teléfono" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
      <button type="submit">Registrarse</button>
    </form>
  );
}

export default Register;