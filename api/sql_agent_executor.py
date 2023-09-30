import io
import sys
import re
from langchain.agents import create_sql_agent
from langchain.agents.agent_toolkits import SQLDatabaseToolkit
from langchain.sql_database import SQLDatabase
from langchain.llms.openai import OpenAI
from constants import DATABASE_URI

class SQLAgentExecutor:
    def __init__(self):
        # Initialize the language model
        self.llm = OpenAI(temperature=0)

        # Initialize the database
        self.db = SQLDatabase.from_uri(DATABASE_URI)

        # Create the toolkit
        self.toolkit = SQLDatabaseToolkit(db=self.db, llm=self.llm)

        # Create the agent
        self.agent = create_sql_agent(llm=self.llm, toolkit=self.toolkit, verbose=True)

    def get_database_connection(self):
        return self.db

    def execute_natural_language_query(self, natural_language_query, context):
        # Redirect stdout to a string buffer
        buffer = io.StringIO()
        sys.stdout = buffer

        # Run the query
        response = self.agent.run(natural_language_query)

        # Get the logs from the buffer
        logs = buffer.getvalue()

        # Reset stdout to its original value
        sys.stdout = sys.__stdout__

        # Return the logs
        return response, logs

    def get_last_sql_query(self, logs):
        # Split the logs into lines
        lines = logs.split("\n")

        # Reverse the lines so we start from the end
        lines.reverse()

        # Iterate over the reversed lines
        for line in lines:
            # If the line starts with "Action Input: ", return the part of the line up to the first ";"
            if line.startswith("Action Input: "):
                end_index = line.find(";")
                if end_index != -1:
                    return line[len("Action Input: "):end_index+1]
                else:
                    return line[len("Action Input: "):-4] + ";"

        # If no "Action Input:" line is found, return None
        return None
    
    def ask_agent(self, question, context):
        response, logs = self.execute_natural_language_query(question, context)
        last_sql_query = self.get_last_sql_query(logs)
        return response, last_sql_query, logs
    
    def execute_sql_query(self, sql_query):
        # Execute the SQL query
        result = self.db.run(sql_query)
        
        # Get the table names from the SQL query
        table_names = self.get_table_names(sql_query)
        
        # Initialize an empty dictionary to store the columns of each table
        table_columns = {}
        
        # For each table name, get its columns
        for table_name in table_names:
            # Get the column names from the table creation command
            column_names = self.get_column_names(self.db.get_table_info([table_name]))
            
            # Add the column names to the dictionary
            table_columns[table_name] = column_names
        
        # Return the table columns and the result of the SQL query
        return table_columns, result
    
    def get_table_names(self, sql_query):
        # Remove the contents of parentheses in SQL JOINs
        sql_query = re.sub(r'\(.*?\)', '', sql_query)

        # Matches only table_name AS t1 (table_name can be `table_name` or table_name)
        matches = re.findall(r'\b(FROM|JOIN|UPDATE|INTO|TABLE)\s+`?(.*?)[`\s]', sql_query, re.IGNORECASE)

        # Extract table names from matches
        table_names = [match[1] for match in matches]

        return table_names
    
    def get_column_names(self, table_creation_command):
        # Find the part of the command between the parentheses
        match = re.search(r'\((.*?)\)', table_creation_command, re.DOTALL)
        
        if match is None:
            return []

        between_parentheses = match.group(1)

        # Split this part into lines
        lines = between_parentheses.split("\n")

        # Initialize an empty list to store the column names
        column_names = []

        # Iterate over the lines
        for line in lines:
            # Strip leading and trailing whitespace
            line = line.strip()

            # If the line is not empty and does not start with a keyword
            if line and not re.match(r'(PRIMARY KEY|FOREIGN KEY)', line):
                # The column name is the first word of the line
                column_name = line.split()[0].strip('"')
                column_names.append(column_name)

        return column_names