import unittest
from sql_agent_executor import SQLAgentExecutor

class TestSQLAgentExecutor(unittest.TestCase):
    def setUp(self):
        self.executor = SQLAgentExecutor()

    def test_get_column_names(self):
        table_creation_command = """
        CREATE TABLE "Employees" (
                "ID" INTEGER,
                "Name" TEXT NOT NULL,
                "Age" INTEGER NOT NULL,
                "Salary" REAL,
                PRIMARY KEY ("ID")
        )
        """
        expected_output = ['ID', 'Name', 'Age', 'Salary']
        self.assertEqual(self.executor.get_column_names(table_creation_command), expected_output)

    def test_get_table_names(self):
        sql_query = """
        SELECT Employees.Name, Departments.Name 
        FROM Employees 
        JOIN Departments ON Employees.DepartmentId = Departments.Id
        """
        expected_output = ['Employees', 'Departments']
        self.assertEqual(self.executor.get_table_names(sql_query), expected_output)

    # Add more test methods as needed

if __name__ == '__main__':
    unittest.main()