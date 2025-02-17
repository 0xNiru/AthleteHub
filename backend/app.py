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
        
        # Format the prompt to get a cleaner response
        prompt = f"""Based on the symptoms: {symptoms}
        
        Please provide an analysis in the following format:
        remember to use proper formatting while generating the response.

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
            return jsonify({"prediction": response.text})
        else:
            app.logger.error("Empty response from Gemini API")
            return jsonify({"error": "Empty response from AI model"}), 500

    except Exception as e:
        app.logger.error(f"Error in predict_injury: {str(e)}", exc_info=True)
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/financial-plan', methods=['POST'])
def create_financial_plan():
    try:
        data = request.get_json()
        sport = data.get('sport')
        level = data.get('level')  # amateur, semi-pro, professional
        budget = data.get('monthly_budget')
        goals = data.get('goals')

        prompt = f"""Create a detailed sports financial plan for a {level} athlete in {sport} 
        with a monthly budget of {budget}. Their goals are: {goals}

        Please provide a comprehensive plan covering:
        and dont use any asterisks or any other formatting.

        1. Budget Breakdown
        - Essential equipment costs
        - Training expenses
        - Competition fees
        - Travel costs
        - Nutrition budget
        - Medical/Insurance costs

        2. Investment Strategies
        - Short-term savings for upcoming competitions
        - Long-term career planning
        - Emergency fund recommendations
        - Insurance considerations

        3. Revenue Opportunities
        - Potential sponsorship avenues
        - Competition prize money
        - Coaching opportunities
        - Brand building suggestions

        4. Cost-Saving Tips
        - Equipment maintenance
        - Group training options
        - Off-season planning
        - Discount programs

        5. Financial Milestones
        - 3-month goals
        - 6-month targets
        - 1-year objectives
        - Long-term financial planning
        """

        response = model.generate_content(prompt)
        financial_plan = response.text

        return jsonify({"financial_plan": financial_plan})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
