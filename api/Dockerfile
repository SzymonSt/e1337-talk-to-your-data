FROM python:3.8-slim-buster
WORKDIR /app
COPY . /app
ARG OPENAI_API_KEY
RUN pip install -r requirements.txt
ENV OPENAI_API_KEY=${OPENAI_API_KEY}
CMD ["python", "main.py"]
