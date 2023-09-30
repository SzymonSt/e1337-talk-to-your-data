import unittest
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
        self.agent.run("What is the Employee with the longest name?")

if __name__ == '__main__':
    unittest.main()