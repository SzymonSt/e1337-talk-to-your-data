from sql_agent_executor import SQLAgentExecutor
import uvicorn
import base64
import json
import sys
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from helpers import get_config
from llm import LLMInterface

def main():
    executor = SQLAgentExecutor()
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
    # llm, db = init(llm_mode)

    @app.post("/connect_db")
    async def connect_db(req: Request):
        body = await req.json()
        ok, content = db.connect(body['host'], body['dbname'], body['user'], body['password'], body['sql_flavour'])
        if(not ok):
            return Response(status_code=400, content="Connection to database failed")
        return Response(status_code=200, content=json.dumps(content), headers={"Content-Type": "application/json"})


    # @app.post("/generate_sql_query")
    # async def generate_sql_query(base64_encoded_human_message: str = None, req : Request = None):
    #     human_message = base64.b64decode(base64_encoded_human_message).decode("utf-8")
    #     data_context = None
    #     query_context = None
    #     try:
    #         body = await req.json()
    #         data_context = body['data_context']
    #         query_context = body['query_context']
    #     except:
    #         pass
    #     current_db_schema = {"tables": db.table_objects, "indices": db.index_objects}
    #     query = llm.generate_query(human_message, current_db_schema, data_context, query_context)
    #     return Response(status_code=200, content=query)

    # @app.post("/execute_sql_query")
    # async def execute_sql_query(req: Request):
    #     body = await req.json()
    #     q=body['query']
    #     res, columns, ok = db.execute_query(q)
    #     if not ok:
    #         return Response(status_code=400, content="Query execution failed")
        
    #     content = db.parseIfDDL(q)
    #     if res is not None:
    #         content = []
    #         for row in res:
    #             content.append(dict(zip([column[0] for column in columns], row)))

    #     return Response(status_code=200, content=json.dumps(content), headers={"Content-Type": "application/json"})

    @app.post("/get_sql_result_visualization")
    async def get_sql_result_visualization():
        pass
    
    @app.post("/get_sql_result_insight")
    async def get_sql_result_insight():
        pass
    
    @app.get("/ask_agent")
    def ask_agent(question: str, context: str):
        response, last_sql_query, logs = executor.ask_agent(question, context)
        return {"response": response, "sql_query": last_sql_query, "logs": logs}
    
    @app.post("/execute_sql_query")
    async def execute_sql_query(sql_query: str):
        columns, result = executor.execute_sql_query(sql_query)
        return {"result": result, "columns": columns}
    

    uvicorn.run(app, host="0.0.0.0", port=8081)

if __name__ == '__main__':
    main()