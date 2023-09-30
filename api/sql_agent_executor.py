import io
import sys
import re
import sqlite3
from langchain.agents import create_sql_agent
from langchain.agents.agent_toolkits import SQLDatabaseToolkit
from langchain.sql_database import SQLDatabase
from langchain.llms import GPT4All
from langchain.llms.openai import OpenAI
from langchain.callbacks.manager import CallbackManager
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler 
from constants import DATABASE_URI

class SQLAgentExecutor:
    def __init__(self, llm_mode: str):
        if llm_mode == 'local':
            self.llm = GPT4All(
                model="../model/GPT4All-13B-snoozy.ggmlv3.q4_0.bin",
                backend="gptj",
                callbacks = [StreamingStdOutCallbackHandler()]
            )
        else:
            self.llm = OpenAI(temperature=0.1)
        self.chain_executor_db = SQLDatabase.from_uri(DATABASE_URI)
        self.db = sqlite3.connect("./db/test.d")
        self.toolkit = SQLDatabaseToolkit(db=self.chain_executor_db, llm=self.llm)
        self.agent = create_sql_agent(llm=self.llm, toolkit=self.toolkit, verbose=True)

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

        return column_names