from openai import OpenAI
from dotenv import load_dotenv 
import os
import json
import os
load_dotenv()
client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

def generate_questions(context, prompt):
    """
    Generate questions using the OpenAI API based on the provided context and prompt.

    Args:
        context (str): The context for question generation.
        prompt (str): The prompt for question generation.

    Returns:
        list: The generated questions.
    """
    response = client.chat.completions.create(model='gpt-3.5-turbo',
    messages=[
        {
            'role': 'system',
            'content': f"Given the context: \"{context}\" and the prompt: \"{prompt}\", generate ten questions that can be asked to help write an essay. Format the response as a JSON object with keys from 0 to 9 and corresponding question values."
        }
    ])
    questions_text = response.choices[0].message.content.strip()
    print(f'questions_text: {questions_text}')
    id_questions = json.loads(questions_text)
    print(f'questions: {id_questions}')
    return id_questions


def generate_essay(context, prompt, questions, answers):
    """
    Generate an essay using the OpenAI API based on the provided context, prompt, questions, and answers.

    Args:
        context (str): The context for essay generation.
        prompt (str): The prompt for essay generation.
        questions (list): The list of questions.
        answers (list): The list of corresponding answers.

    Returns:
        str: The generated essay.
    """
    formatted_answers = '\n'.join([f"Q: {question}\nA: {answer}" for question, answer in zip(questions, answers)])
    response = client.chat.completions.create(model='gpt-3.5-turbo',
    messages=[
        {
            'role': 'system',
            'content': f"Given the context: \"{context}\", the prompt: \"{prompt}\", and the following questions and answers:\n{formatted_answers}\n\nWrite a well-structured essay based on the provided information."
        }
    ])
    essay = response.choices[0].message.content.strip()
    return essay
