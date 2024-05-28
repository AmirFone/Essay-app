const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function generateQuestions(context, prompt) {
  const response = await openai.createCompletion({
    model: 'text-davinci-002',
    prompt: `Given the context: "${context}" and the prompt: "${prompt}", generate ten questions that can be asked to help write an essay. Format the response as a JSON object with keys from 0 to 9 and corresponding question values.`,
    max_tokens: 300,
    n: 1,
    stop: null,
    temperature: 0.7,
  });

  const questionsText = response.data.choices[0].text.trim();
  const questions = JSON.parse(questionsText);
  return Object.values(questions);
}

async function generateEssay(context, prompt, questions, answers) {
  const formattedAnswers = questions.map((question, index) => `Q: ${question}\nA: ${answers[index]}`).join('\n');
  const response = await openai.createCompletion({
    model: 'text-davinci-002',
    prompt: `Given the context: "${context}", the prompt: "${prompt}", and the following questions and answers:\n${formattedAnswers}\n\nWrite a well-structured essay based on the provided information.`,
    max_tokens: 500,
    n: 1,
    stop: null,
    temperature: 0.7,
  });

  const essay = response.data.choices[0].text.trim();
  return essay;
}

module.exports = {
  generateQuestions,
  generateEssay,
};