"use client";
import React from 'react';
import EssayForm from './EssayForm';
import styles from './HomePage.module.css'; // Import the CSS module

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-400 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className={`absolute inset-0 ${styles.formBackground} shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl`}></div>
        <div className={`relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20 ${styles.shadowCustom}`}>
          <h1 className={`text-2xl font-semibold mb-6 ${styles.formTitle}`}>Essay Generator</h1>
          <EssayForm />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
