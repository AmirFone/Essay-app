import React, { useState } from 'react';
import { useRouter } from 'next/router';

const EssayForm = () => {
  const [context, setContext] = useState('');
  const [prompt, setPrompt] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context, prompt }),
    });
    const data = await response.json();
    router.push(`/questions?id=${data.id}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Context:
        <input type="text" value={context} onChange={(e) => setContext(e.target.value)} />
      </label>
      <label>
        Prompt:
        <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
      </label>
      <button type="submit">Generate Questions</button>
    </form>
  );
};

export default EssayForm;