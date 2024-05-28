require('dotenv').config();
const { OpenAI } = require('openai');
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// const openai = new OpenAIApi(configuration);

async function generateQuestions(context, prompt) {
  const params = {
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: `Given the context: "${context}" and the prompt: "${prompt}", generate ten questions that can be asked to help write an essay. Format the response as a JSON object with keys from 0 to 9 and corresponding question values.`,
      }
    ],
  };
  const chatCompletion = await openai.chat.completions.create(params);
  const questionsText = chatCompletion.choices[0].message.content.trim();
  const questions = JSON.parse(questionsText);
  return Object.values(questions);
}

async function generateEssay(context, prompt, questions, answers) {
  const formattedAnswers = questions.map((question, index) => `Q: ${question}\nA: ${answers[index]}`).join('\n');
  const params = {
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: `Given the context: "${context}", the prompt: "${prompt}", and the following questions and answers:\n${formattedAnswers}\n\nWrite a well-structured essay based on the provided information.`,
      }
    ],
  };
  const chatCompletion = await openai.chat.completions.create(params);
  const essay = chatCompletion.choices[0].message.content.trim();
  return essay;
}


module.exports = {
  generateQuestions,
  generateEssay,
};