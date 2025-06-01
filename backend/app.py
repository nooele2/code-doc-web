from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import google.generativeai as genai
import requests
import os

app = Flask(__name__)
CORS(app)

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        code = request.form.get('prompt')
        api_key = request.form.get('apiKey')
        api_key_type = request.form.get('apiKeyType', 'OpenAI')
        detail_level = request.form.get('detailLevel', 'Basic')
        feature_type = request.form.get('featureType', 'Comments')

        # File handling (optional for future logic)
        use_default_doc = request.form.get('useDefaultDoc') == 'true'
        uploaded_file = request.files.get('file')

        if not code or not api_key:
            return jsonify({'error': 'Missing code or API key'}), 400

        if api_key_type == 'OpenAI':
            result = call_openai(code, api_key, feature_type, detail_level)
        elif api_key_type == 'Gemini':
            result = call_gemini(code, api_key, feature_type, detail_level)
        elif api_key_type == 'DeepSeek':
            result = call_deepseek(code, api_key, feature_type, detail_level)
        else:
            return jsonify({'error': 'Unsupported API provider'}), 400

        return jsonify({'response': result})

    except Exception as e:
        return jsonify({'error': str(e)}), 500


def call_openai(code, api_key, feature_type, detail_level):
    openai.api_key = api_key
    prompt = generate_prompt(code, feature_type, detail_level)
    response = openai.ChatCompletion.create(
        model='gpt-3.5-turbo',
        messages=[{'role': 'user', 'content': prompt}],
        temperature=0.7
    )
    return response.choices[0].message['content'].strip()


def call_gemini(code, api_key, feature_type, detail_level):
    genai.configure(api_key=api_key)
    prompt = generate_prompt(code, feature_type, detail_level)
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content(prompt)
    return response.text.strip()


def call_deepseek(code, api_key, feature_type, detail_level):
    prompt = generate_prompt(code, feature_type, detail_level)
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    data = {
        "model": "deepseek-coder",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7
    }
    url = "https://api.deepseek.com/v1/chat/completions"
    response = requests.post(url, headers=headers, json=data)
    response.raise_for_status()
    return response.json()['choices'][0]['message']['content'].strip()


def generate_prompt(code, feature_type, detail_level):
    if feature_type == "Comments":
        return f"Add {detail_level.lower()} comments to the following code:\n\n{code}"
    elif feature_type == "Rename":
        return f"Suggest better variable and function names for the following code with {detail_level.lower()} detail:\n\n{code}"
    else:
        return f"Analyze the following code:\n\n{code}"

if __name__ == '__main__':
    app.run(debug=True)
