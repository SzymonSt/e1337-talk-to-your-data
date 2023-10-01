# Use an official Python runtime as a base image
FROM python:3.8-slim-buster

# Set the working directory
WORKDIR /usr/src/app

# Copy the current directory contents into the container at /usr/src/app
COPY . /usr/src/app

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Define environment variable for the URL
ARG LOCAL_LLM_URL

# Download the file from the URL passed as build argument, if provided
RUN if [ -n "$LOCAL_LLM_URL" ]; then wget $LOCAL_LLM_URL -P /usr/src/app/data/; fi

# Run app.py when the container launches
CMD ["python", "main.py"]
