from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
import google.generativeai as genai
import logging
import os
import markdown
from google.generativeai import GenerativeModel

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Load API Key
API_KEY = os.environ.get("GEMINI_API_KEY")
if not API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable is not set")
genai.configure(api_key=API_KEY)

# Utility function to convert Markdown to formatted HTML
def format_markdown(text):
    return markdown.markdown(text, extensions=["fenced_code", "tables"])

@app.route('/predict', methods=['POST'])
def predict_injury():
    try:
        app.logger.info("Received injury prediction request")
        data = request.get_json()
        symptoms = data.get("symptoms", "").strip()

        if not symptoms:
            return jsonify({"error": "No symptoms provided"}), 400

        model = genai.GenerativeModel('gemini-2.0-flash')

        # Improved prompt for structured response
        prompt = f"""
        You are a responsible sports doctor. Analyze the symptom: **"{symptoms}"**  
        Provide a structured, concise response covering:  

        **1. Possible Injuries**  
        **2. Recovery Plan**  
        **3. Fitness Improvement Strategy**  

        Format the response in markdown with bullet points, headings, and structured sections.
        """

        app.logger.info("Sending request to Gemini API")
        response = model.generate_content(prompt)

        if response and response.text:
            formatted_response = format_markdown(response.text)
            return jsonify({"prediction": formatted_response})
        else:
            return jsonify({"error": "Empty response from AI model"}), 500

    except Exception as e:
        logger.error(f"Error in predict_injury: {str(e)}", exc_info=True)
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/financial-plan', methods=['POST'])
def create_financial_plan():
    try:
        logger.info("Received financial plan request")
        data = request.get_json()

        required_fields = ['sport', 'level', 'monthly_budget', 'goals']
        missing_fields = [field for field in required_fields if not data.get(field)]

        if missing_fields:
            return jsonify({"error": f"Missing required fields: {', '.join(missing_fields)}"}), 400

        model = GenerativeModel('gemini-2.0-flash')

        # Improved structured prompt
        prompt = f"""
        Create a **detailed sports financial plan** for a **{data['level']}** athlete in **{data['sport']}**  
        with a **monthly budget of {data['monthly_budget']}**. Their goals are: **{data['goals']}**  

        Provide a well-structured response covering:  

        **1. Budget Breakdown**  
        **2. Investment Strategies**  
        **3. Revenue Opportunities**  
        **4. Cost-Saving Tips**  
        **5. Financial Milestones**  

        Format the response in markdown with bullet points, tables, and headings.
        """

        logger.info("Sending request to Gemini API")
        response = model.generate_content(prompt)

        if response and response.text:
            formatted_response = format_markdown(response.text)
            return jsonify({"financial_plan": formatted_response})
        else:
            return jsonify({"error": "Empty response from AI model"}), 500

    except Exception as e:
        logger.error(f"Error in financial plan generation: {str(e)}", exc_info=True)
        return jsonify({"error": f"Failed to generate financial plan: {str(e)}"}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
