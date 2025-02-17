# isme flask ka use karenge 
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import logging

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

API_KEY = "AIzaSyCBVlvUZNgEsbq2uNHPIarHCX48hlfz8T8"  
genai.configure(api_key=API_KEY)

@app.route('/predict', methods=['POST'])
def predict_injury():
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
        
        prompt = f"""
        A professional athlete is experiencing the following symptoms: {symptoms}.
        1. Predict possible injuries.
        2. Suggest a recovery plan.
        3. Provide a fitness improvement strategy.
        """

        app.logger.debug("Sending request to Gemini API")
        response = model.generate_content(prompt)
        
        if response and response.text:
            app.logger.debug("Successfully received response from Gemini")
            app.logger.info(f"Prediction result: {response.text}")
            return jsonify({"prediction": response.text})
        else:
            app.logger.error("Empty response from Gemini API")
            return jsonify({"error": "Empty response from AI model"}), 500

    except Exception as e:
        app.logger.error(f"Error in predict_injury: {str(e)}", exc_info=True)
        return jsonify({"error": f"Server error: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
