FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy the application code
COPY . .

# Install dependencies
RUN pip install --no-cache-dir -r backend/requirements.txt

# Set the command to run the application
CMD ["python", "backend/app.py"]
