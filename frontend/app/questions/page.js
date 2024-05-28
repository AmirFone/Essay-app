import React from 'react';
import QuestionForm from '../QuestionForm';

const QuestionsPage = ({ searchParams }) => {
  const { id } = searchParams;

  return (
    <div>
      <h1>Answer the Questions</h1>
      <QuestionForm id={id} />
    </div>
  );
};

export default QuestionsPage;