from langchain.agents import SQLAgent

class CustomSQLAgent(SQLAgent):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.query_log = []

    def execute_query(self, query):
        self.query_log.append(query)
        return super().execute_query(query)

# Create the agent
agent = CustomSQLAgent(llm=llm, toolkit=toolkit, verbose=True)

# Run a query
agent.run("What is the Employee with the longest name?")

# Access the logged queries
print(agent.query_log)