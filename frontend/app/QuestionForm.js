"use client";
import styles from './QuestionForm.module.css';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AudioRecorder from './AudioRecorder';

const QuestionForm = ({ context, prompt }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchQuestions = async () => {
      const response = await fetch('http://127.0.0.1:3001/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context, prompt }),
      });
      const data = await response.json();
      setQuestions(Object.values(data.id_questions));
    };
    fetchQuestions();
  }, [context, prompt]);

  const handleRecordingStop = (questionIndex, audioBlob) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Audio = reader.result.split(',')[1];
      setAnswers((prevAnswers) => ({
        ...prevAnswers,
        [questions[questionIndex]]: base64Audio,
      }));
    };
    reader.readAsDataURL(audioBlob);
  };

  const handleNext = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://127.0.0.1:3001/generate-essay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context, prompt, answers }),
    });
    const data = await response.json();
    router.push(`/essay?essay=${encodeURIComponent(data.essay)}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      {questions.length > 0 ? (
        <div className={styles['question-container']}>
          <div className="question-card">
            <h3>{questions[currentQuestionIndex]}</h3>
            <AudioRecorder
              onStop={(audioBlob) => handleRecordingStop(currentQuestionIndex, audioBlob)}
            />
          </div>
          <div className="button-container">
            {currentQuestionIndex < questions.length - 1 && (
              <button type="button" onClick={handleNext} className="next-button">
                Next
              </button>
            )}
            {currentQuestionIndex === questions.length - 1 && (
              <button type="submit" className="submit-button">
                Generate Essay
              </button>
            )}
          </div>
        </div>
      ) : (
        <p>No questions available.</p>
      )}
    </form>
  );
};

export default QuestionForm;