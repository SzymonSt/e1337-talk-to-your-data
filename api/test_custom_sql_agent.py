import unittest
import io
import sys
import re
from langchain.agents import create_sql_agent
from langchain.agents.agent_toolkits import SQLDatabaseToolkit
from langchain.sql_database import SQLDatabase
from langchain.llms.openai import OpenAI

class TestCustomSQLAgent(unittest.TestCase):
    def setUp(self):
        # Initialize the language model
        self.llm = OpenAI(temperature=0)

        # Initialize the database
        self.db = SQLDatabase.from_uri("sqlite:///C://Users//Defozo//Downloads//2//sqlite-dll-win64-x64-3430100//test.d")  # TODO: Replace with your database path

        # Create the toolkit
        self.toolkit = SQLDatabaseToolkit(db=self.db, llm=self.llm)

        # Create the agent
        self.agent = create_sql_agent(llm=self.llm, toolkit=self.toolkit, verbose=True)

    def test_execute_query(self):
        # Redirect stdout to a string buffer
        buffer = io.StringIO()
        sys.stdout = buffer

        # Run the query
        self.agent.run("What is the Employee with the longest name?")

        # Get the logs from the buffer
        logs = buffer.getvalue()

        # Reset stdout to its original value
        sys.stdout = sys.__stdout__

        # Print the logs
        print("Logs:")
        print(logs)

        # Now you can do whatever you want with the logs
        print("Last action input: ")
        print(self.get_last_action_input(logs))

    def get_last_action_input(self, logs):
        # Split the logs into lines
        lines = logs.split("\n")

        # Reverse the lines so we start from the end
        lines.reverse()

        # Iterate over the reversed lines
        for line in lines:
            # If the line starts with "Action Input:", return the rest of the line
            if line.startswith("Action Input: "):
                end_index = line.find(";")
                if end_index != -1:
                    return line[len("Action Input: "):end_index+1]

        # If no "Action Input:" line is found, return None
        return None

if __name__ == '__main__':
    unittest.main()