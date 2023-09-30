from typing import List
from sql_agent_executor import SQLAgentExecutor
import uvicorn
import base64
import sqlite3
import json
import sys
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from helpers import get_config
from llm import LLMInterface
from langchain.schema.messages import HumanMessage, AIMessage
from pydantic import BaseModel
from typing import Any, Dict, List

class Message(BaseModel):
    content: str
    additional_kwargs: Dict[str, Any]
    type: str
    example: bool

class AskAgentBody(BaseModel):
    chat_history: List[Message] = []
    question: str

def main():

    app = FastAPI()
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    if len(sys.argv) > 1 and sys.argv[1] == '--local':
        llm_mode = 'local'
    else:
        llm_mode = 'remote'
    executor = SQLAgentExecutor(llm_mode)
    
    @app.post("/ask_agent")
    async def ask_agent(body: AskAgentBody):
        chat_history = body.chat_history
        question = body.question
        chat_history.append(HumanMessage(content=question))
        response, last_sql_query, logs = executor.ask_agent(question, chat_history)
        chat_history.append(AIMessage(content=last_sql_query))
        return {"response": response, "sql_query": last_sql_query, "logs": logs, "chat_history": chat_history}

    @app.post("/execute_sql_query")
    async def execute_sql_query(req: Request):
        body = await req.json()
        sql_query=body['query']
        chat_history=body["chat_history"]
        content = []
        result, columns = executor.execute_sql_query(sql_query)
        for row in result:
            content.append(dict(zip([column[0] for column in columns], row)))

        chat_history.append(HumanMessage(content=sql_query))
        chat_history.append(AIMessage(content=json.dumps(content)))

        return {"result": content, "chat_history": chat_history}
    

    uvicorn.run(app, host="0.0.0.0", port=8081)

if __name__ == '__main__':
    main()