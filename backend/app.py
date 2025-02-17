# isme flask ka use karenge 
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import logging
import os

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

API_KEY = "AIzaSyCBVlvUZNgEsbq2uNHPIarHCX48hlfz8T8"  
genai.configure(api_key=API_KEY)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        app.logger.info("Received prediction request")
        data = request.get_json()
        symptoms = data.get("symptoms", "")
        
        app.logger.info(f"Symptoms received: {symptoms}")

        if not symptoms:
            return jsonify({"error": "No symptoms provided"}), 400

        # Initialize model
        app.logger.debug("Initializing Gemini model")
        model = genai.GenerativeModel('gemini-pro')
        
        # Format the prompt to get a cleaner response
        prompt = f"""Based on the symptoms: {symptoms}
        
        Please provide an analysis in the following format:

        AI Predictions & Insights:

        1. Possible Injuries
        - List potential injuries
        - Use bullet points without asterisks

        2. Recovery Plan
        - List recovery steps
        - Use bullet points without asterisks

        3. Fitness Improvement Strategy
        - List improvement strategies
        - Use bullet points without asterisks
        """

        app.logger.debug("Sending request to Gemini API")
        response = model.generate_content(prompt)
        
        if response and response.text:
            app.logger.debug("Successfully received response from Gemini")
            app.logger.info(f"Prediction result: {response.text}")
            # Clean up the response
            prediction = response.text.replace('*', '•')  # Replace asterisks with bullet points
            prediction = prediction.replace('•', '-')     # Or replace with simple dashes
            return jsonify({"prediction": prediction})
        else:
            app.logger.error("Empty response from Gemini API")
            return jsonify({"error": "Empty response from AI model"}), 500

    except Exception as e:
        app.logger.error(f"Error in prediction: {str(e)}", exc_info=True)
        return jsonify({"error": f"Server error: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
