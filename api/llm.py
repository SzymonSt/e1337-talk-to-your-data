import json
from langchain.schema import SystemMessage, HumanMessage
from langchain.chat_models import ChatOpenAI
from langchain.embeddings import OpenAIEmbeddings
class LLMInterface():
    MODEL_NAME = "gpt-3.5-turbo"
    TEMPERATURE = 0.1
    GENERATE_QUERY_SYSTEM_MESSAGE = """
        You are SQL and DDL queries generator.

        There are few rules:
        1. You can only generate SQL and DDL queries. If user provides a message based on which you cannot generate a query,
        you should answer with a message "I don't understand, can you precise what data you want to create or retrieve?

        2. Users can define their own data structures. You should be able to generate queries for any data structure using DDL.

        3. Users can define their own data. You should be able to generate queries for any data using SQL.

        4. You return just the query string in content and no other text.

        5. Generate queries for PostgreSQL.

        6. If users asks to retrive the data from tables or columns that are not in the schema, 
        you answer with a message: I cannot find this data.

        """
    
    USER_TEMPLATE_MESSAGE = """
        Based on following database schema:
        Tables: {tables}
        Indices: {indices}
        and optionally following data and references query context: 
        Data: {data_context}
        Queries: {query_context}
        Please generate an sql query for following message: {message}
        If message asks about query for tables or columns that are not in the schema, answer with a message: I cannot find this data.
    """

    def __init__(self, llm_key: str):
        self.pred = ChatOpenAI(
            openai_api_key=llm_key,
            temperature=self.TEMPERATURE,
            model=self.MODEL_NAME
        )

    def generate_query(self, human_message: str, db_schema: dict, data_context: dict, query_context: dict) -> str:
        system_message = self.GENERATE_QUERY_SYSTEM_MESSAGE
        print(system_message)

        human_message_from_template = self.USER_TEMPLATE_MESSAGE.format(
                tables=["table: {} , colums: {}".format(table, db_schema["tables"][table]) for table in db_schema["tables"]], 
                indices=["index: {}".format(index) for index in db_schema["indices"]],
                data_context=data_context,
                query_context=query_context,
                message=human_message)
        print(human_message_from_template)
        message_set = [
            SystemMessage(content=system_message),
            HumanMessage(content=human_message_from_template),
        ]
        prediction = self.pred(message_set)
        return prediction.content

    def provide_insight(self, data: str) -> str:
        pass

    def provide_visualization(self, data: str) -> str:
        pass