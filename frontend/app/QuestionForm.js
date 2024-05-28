import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const QuestionForm = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchQuestions = async () => {
      const response = await fetch(`/api/generate?id=${id}`);
      const data = await response.json();
      setQuestions(data.questions);
    };
    fetchQuestions();
  }, [id]);

  const handleChange = (index, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [index]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, answers }),
    });
    const data = await response.json();
    router.push(`/essay?id=${data.id}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      {questions.map((question, index) => (
        <div key={index}>
          <h3>{question}</h3>
          <textarea
            value={answers[index] || ''}
            onChange={(e) => handleChange(index, e.target.value)}
          />
        </div>
      ))}
      <button type="submit">Generate Essay</button>
    </form>
  );
};

export default QuestionForm;