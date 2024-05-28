const express = require('express');
const cors = require('cors');
const { generateQuestions, generateEssay } = require('./openai');

const app = express();
app.use(express.json());
app.use(cors());  // Enable CORS for all route
const data = {};

app.post('/generate-questions', async (req, res) => {
  const { context, prompt } = req.body;
  const questions = await generateQuestions(context, prompt);
  const id = Date.now().toString();
  data[id] = { context, prompt, questions };
  res.json({ id });
});

app.post('/generate-essay', async (req, res) => {
  const { id, answers } = req.body;
  const { context, prompt, questions } = data[id];
  const essay = await generateEssay(context, prompt, questions, answers);
  data[id].essay = essay;
  res.json({ id });
});

app.get('/data', (req, res) => {
  const { id } = req.query;
  if (data[id]) {
    res.json(data[id]);
  } else {
    res.status(404).json({ error: 'Data not found' });
  }
});

app.listen(3001, () => {
  console.log('Backend server is running on port 3001');
});