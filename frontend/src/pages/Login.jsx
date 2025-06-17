import React, { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handle = (e) => {
    e.preventDefault();
    alert('Logged in!');
  };

  return (
    <form onSubmit={handle} className="p-4 max-w-sm mx-auto space-y-4">
      <input
        className="border p-2 w-full rounded"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="border p-2 w-full rounded"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="w-full bg-blue-600 text-white py-2 rounded">Login</button>
    </form>
  );
}
