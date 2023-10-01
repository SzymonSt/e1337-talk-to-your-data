# SQLucjan Finance Web Application

## Description
SQLucjan is designed for the Ministry of Finance, transforming natural language inquiries into SQL queries to extract data from databases. Users type their queries in natural language, receive a response from the LLM along with the SQL query used. They can tweak this query and run it to fetch data directly from the database, bypassing the AI. SQLucjan operates offline, ensuring data security.

## Backend

### Building the Docker Image

Ensure Docker is installed.

During the build process, you can provide an argument `LOCAL_LLM_URL` to automatically download an open-source LLM model into the application container. Replace `<LLM_URL>` with the actual URL of the LLM model.

```bash
docker build -t sqlucjan-app --build-arg LOCAL_LLM_URL=<LLM_URL> .
```

### Running the Application

#### Using Docker

Run the Docker container:

```bash
docker run -p 8081:8081 sqlucjan-app
```

## Frontend

### Running the Application

#### Development Mode

1. Navigate to the project directory in your terminal.
2. Install the necessary dependencies with `npm install`.
3. Start the application in development mode with `npm start`.
4. Access the application in your web browser at `http://localhost:3000`.

#### Production Mode

1. Build the project for production with `npm run build`.
2. Install a static server globally with `npm install -g serve`.
3. Start the application in production mode with `serve -s build`.
4. Access the application in your web browser at the provided URL.
