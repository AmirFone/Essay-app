"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './HomePage.module.css';
import QuestionForm from './QuestionForm';

const EssayForm = () => {
  const [context, setContext] = useState('');
  const [prompt, setPrompt] = useState('');
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowQuestionForm(true);
  };

  return (
    <>
      {!showQuestionForm ? (
        <form onSubmit={handleSubmit}>
          <label className={styles.formLabel}>
            Context:
            <input
              type="text"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className={styles.inputCustom}
            />
          </label>
          <label className={styles.formLabel}>
            Prompt:
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className={styles.inputCustom}
            />
          </label>
          <button type="submit" className={styles.submitButton}>
            Generate Questions
          </button>
        </form>
      ) : (
        <QuestionForm context={context} prompt={prompt} />
      )}
    </>
  );
};

export default EssayForm;