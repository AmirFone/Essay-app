from flask import Flask, request, jsonify
from flask_cors import CORS
from openai_utils import generate_questions, generate_essay
import base64
import json
import os
from openai import OpenAI
from dotenv import load_dotenv 
load_dotenv()
client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
import tempfile

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

data = {}

@app.route('/generate-questions', methods=['POST'])
def generate_questions_route():
    """
    Generate questions based on the provided context and prompt.

    Request JSON:
    {
        "context": "The context for question generation",
        "prompt": "The prompt for question generation"
    }

    Response JSON:
    {
        "questions": "The generated questions based on the context and prompt"
    }
    """
    context = request.json.get('context')
    prompt = request.json.get('prompt')

    if not context or not prompt:
        return jsonify({'error': 'Missing context or prompt'}), 400

    questions = generate_questions(context, prompt)

    return jsonify({'id_questions': questions}), 200
 
@app.route('/generate-essay', methods=['POST'])
def generate_essay_route():
    """
    Generate an essay based on the question ID and provided audio answers.

    Request JSON:
    {
        "id": "The question ID",
        "answers": {
            "Question 1": "Base64-encoded audio string",
            ...
        }
    }

    Response JSON:
    {
        "id": "The unique identifier for the generated essay",
        "essay": "The generated essay text"
    }
    """
    question_id = request.json.get('id')
    answers = request.json.get('answers')

# #     print(f"data: {data}")
#     if not question_id or not answers:
#         return jsonify({'error': 'Missing question ID or answers'}), 400

#     if question_id not in data:
#         return jsonify({'error': 'Invalid question ID'}), 404

    context = request.json.get('context')
    prompt = request.json.get('prompt')
    transcribed_answers = {}
    for question, audio_string in answers.items():
        audio_data = base64.b64decode(audio_string)
        transcribed_answer = transcribe_audio(audio_data)
        transcribed_answers[question] = transcribed_answer

    question_answer_json = json.dumps(transcribed_answers)

    essay_prompt = (f"Given the context: \"{context}\", the prompt: \"{prompt}\", and the following question-answer JSON:\n"
                    f"{question_answer_json}\n\nWrite a well-structured essay based on the provided information. Use the tonality and answers given by the user "
                    "in the audio to guide the essay's content and style. Try to preserve as much of the user's content that is relevant to the essay because at the end of the day, "
                    "the essay is of the user and that is very important. Additionally, take into consideration anything mentioned within the questions as being important or relevant "
                    "to the essay and respond accordingly. In your response, only give me the essay as a response, and nothing else just the essay that the user can use do not include anything else or else will mess up the output.")

    essay_response = client.chat.completions.create(model='gpt-4-turbo',
    messages=[
        {
            'role': 'system',
            'content': essay_prompt
        }
    ])

    essay = essay_response.choices[0].message.content.strip()

    data[question_id]['essay'] = essay

    return jsonify({'id': question_id, 'essay': essay}), 200

def transcribe_audio(audio_data):
    """
    Transcribe audio data using OpenAI Whisper.

    :param audio_data: The audio data in bytes.
    :return: The transcribed text.
    """
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_file:
        temp_file.write(audio_data)
        temp_file_path = temp_file.name

    try:
        with open(temp_file_path, "rb") as file:
            transcription = client.audio.transcriptions.create(
                model="whisper-1", 
                file=file,
                file_type='wav'
            )
    finally:
        os.remove(temp_file_path)

    return transcription['text']

@app.route('/data', methods=['GET'])
def get_data():
    """
    Retrieve the generated questions or essay based on the provided ID.

    Request Query Parameters:
    - id: The unique identifier for the generated questions or essay

    Response JSON:
    {
        "context": "The context used for generation",
        "prompt": "The prompt used for generation",
        "questions": ["Question 1", "Question 2", ...],
        "essay": "The generated essay (if available)"
    }
    """
    question_id = request.args.get('id')

    if not question_id:
        return jsonify({'error': 'Missing ID'}), 400

    if question_id not in data:
        return jsonify({'error': 'Data not found'}), 404

    return jsonify(data[question_id]), 200

if __name__ == '__main__':
    app.run(port=3001, debug=True)
