import io
import sys
import re
import sqlite3
from langchain.agents import create_sql_agent
from langchain.agents.agent_toolkits import SQLDatabaseToolkit
from langchain.sql_database import SQLDatabase
from langchain.llms.openai import OpenAI
from langchain.llms import Ollama
from langchain.callbacks.manager import CallbackManager
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler 
from constants import DATABASE_URI

class SQLAgentExecutor:
    def __init__(self, llm_mode: str):
        self.template = """[INST] <<SYS>>
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
              <</SYS>>
            Based on following database schema:
            Tables: {tables}
            And follwing message:
            {message}
            Generate SQL query
            [/INST]"""
        if llm_mode == 'local':
            self.llm = Ollama(base_url="http://localhost:11434", 
             model="llama2:13b", 
             callback_manager = CallbackManager([StreamingStdOutCallbackHandler()]))
        else:
            self.llm = OpenAI(temperature=0.1)
            self.db = sqlite3.connect("./db/hackathon.db")
            self.chain_executor_db = SQLDatabase.from_uri(DATABASE_URI)
            self.toolkit = SQLDatabaseToolkit(db=self.chain_executor_db, llm=self.llm)
            self.agent = create_sql_agent(llm=self.llm, toolkit=self.toolkit, verbose=True)
        self.llm_mode = llm_mode

    def execute_natural_language_query(self, natural_language_query, context):
        buffer = io.StringIO()
        sys.stdout = buffer
        response = self.agent.run(natural_language_query)
        logs = buffer.getvalue()
        sys.stdout = sys.__stdout__
        return response, logs

    def get_last_sql_query(self, logs):
        lines = logs.split("\n")
        lines.reverse()
        for line in lines:
            # If the line starts with "Action Input: ", return the part of the line up to the first ";"
            if line.startswith("Action Input: "):
                end_index = line.find(";")
                if end_index != -1:
                    return line[len("Action Input: "):end_index+1]
                else:
                    return line[len("Action Input: "):-4] + ";"
        return None
    
    def ask_agent(self, question, context):
        if self.llm_mode == 'local':
            curret_schema = self.get_current_schema()
            message_from_temlate = self.template.format(tables=curret_schema, message=question)
            res = self.llm(message_from_temlate)
            print(res)
        else:
            response, logs = self.execute_natural_language_query(question, context)
            last_sql_query = self.get_last_sql_query(logs)
        return response, last_sql_query, logs
    
    def execute_sql_query(self, sql_query) -> (dict, list):
        cursor = self.db.cursor()
        try:
            result = cursor.execute(sql_query)
        except Exception as e:
            cursor.close()
            return None, None
        result = cursor.fetchall()
        columns = cursor.description
        return result, columns
    
    def get_table_names(self, sql_query):
        sql_query = re.sub(r'\(.*?\)', '', sql_query)

        # Matches only table_name AS t1 (table_name can be `table_name` or table_name)
        matches = re.findall(r'\b(FROM|JOIN|UPDATE|INTO|TABLE)\s+`?(.*?)[`\s]', sql_query, re.IGNORECASE)
        table_names = [match[1] for match in matches]

        return table_names
    
    def get_column_names(self, table_creation_command):
        # Find the part of the command between the parentheses
        match = re.search(r'\((.*?)\)', table_creation_command, re.DOTALL)
        
        if match is None:
            return []

        between_parentheses = match.group(1)
        lines = between_parentheses.split("\n")
        column_names = []

        # Iterate over the lines
        for line in lines:
            # Strip leading and trailing whitespace
            line = line.strip()
            if line and not re.match(r'(PRIMARY KEY|FOREIGN KEY)', line):
                column_name = line.split()[0].strip('"')
                column_names.append(column_name)

    def get_current_schema(self):
        tables = {}
        GET_SCHEMA_QUERY = "SELECT name FROM sqlite_schema WHERE type ='table' AND name NOT LIKE 'sqlite_%';"
        GET_TABLES_QUERY = "PRAGMA table_info({table})"
        cursor = self.db.cursor()
        try:
            result = cursor.execute(GET_SCHEMA_QUERY)
        except Exception as e:
            print(e)
            cursor.close()
            return None
        result = cursor.fetchall()
        try:
            for table in result:
                table_name = table[0]
                table_columns = cursor.execute(GET_TABLES_QUERY.format(table=table_name))
                table_columns = cursor.fetchall()
                tables[table_name] = {column[1]: column[2] for column in table_columns}            
        except Exception as e:
            print(e)
            cursor.close()
            return None
        cursor.close()
        return tables


    def set_schema(self, query: str):
        cursor = self.db.cursor()
        try:
            result = cursor.executescript(query)
        except Exception as e:
            print(e)
            cursor.close()
            return None
        result = cursor.fetchall()
        self.db.commit()
        cursor.close()
        return result