# SQLucjan Finance Web Application

## Description
SQLucjan is designed for the Ministry of Finance, transforming natural language inquiries into SQL queries to extract data from databases. Users type their queries in natural language, receive a response from the LLM along with the used SQL query. They can tweak this query and run it to fetch data directly from the database, bypassing the AI. SQLucjan is able to operate offline because of it's modularity, ensuring data security.

## LLM
### Basic
Basic setup uses openai gpt-4 model. set `OPENAI_API_KEY=sk-xxxxxxxxx`.

### Advanced
To run llm in localhost mode advanced setup is required.
Install ollama software to manage and host llama local models: <br>
```bash
sudo curl -L https://ollama.ai/download/ollama-linux-amd64 -o /usr/bin/ollama
sudo chmod +x /usr/bin/ollama
```
Serve model as api: <br>
```bash
ollama server
```
Run llama version: <br>
```bash
ollama run llama2:13b
```
It is accessible via `http://localhost:11434` <br>
## Backend

### Building the Docker Image

Basic
(./api)
```bash
docker build --build-arg OPENAI_API_KEY=XXXXXX -t sqlucjan-app:latest .
```

Advanced
(./api)
```bash
docker build -t sqlucjan-app:latest -f local.Dockerfile .
```

## Frontend

(./frontend)
```bash
docker build -t sqlucjan-fronted:latest  .
```

