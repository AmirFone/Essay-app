"use client";
import React from 'react';

const EssayPage = ({ essay }) => {
  return (
    <div>
      <h1>Generated Essay</h1>
      <p>{essay}</p>
    </div>
  );
};

export default EssayPage;