"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './HomePage.module.css'; // Ensure you're importing the styles

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
      <label className={styles.formLabel}>
        Context:
        <input type="text" value={context} onChange={(e) => setContext(e.target.value)} className={styles.inputCustom} />
      </label>
      <label className={styles.formLabel}>
        Prompt:
        <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} className={styles.inputCustom} />
      </label>
      <button type="submit" className={styles.submitButton}>Generate Questions</button>
    </form>
  );
};

export default EssayForm;
