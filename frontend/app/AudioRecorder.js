// AudioRecorder.js
"use client";
import React, { useState, useRef } from 'react';

const AudioRecorder = ({ onStop }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const handleStartRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.addEventListener('dataavailable', (event) => {
          chunksRef.current.push(event.data);
        });
        mediaRecorder.addEventListener('stop', () => {
          const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
          onStop(audioBlob);
          chunksRef.current = [];
        });
        mediaRecorder.start();
        setIsRecording(true);
      })
      .catch((error) => {
        console.error('Error accessing microphone:', error);
      });
  };

  const handleStopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  return (
    <div>
      {isRecording ? (
        <button type="button" onClick={handleStopRecording}>
          Stop Recording
        </button>
      ) : (
        <button type="button" onClick={handleStartRecording}>
          Start Recording
        </button>
      )}
    </div>
  );
};

export default AudioRecorder;