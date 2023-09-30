import psycopg2
from simple_ddl_parser import DDLParser

CREATE_TABLE_CONST=["CREATE", "TABLE"]
DROP_TABLE_CONST=["DROP", "TABLE"]
ALTER_TABLE_CONST=["ALTER", "TABLE"]
CREATE_INDEX_CONST=["CREATE","INDEX"]
DROP_INDEX_CONST=["DROP"," INDEX"]

INIT_TABLES_DISCOVERY_QUERY =  """
    SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
    """
INIT_TABLE_SCHEMA_DISCOVERY_QUERY =  """
    SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '{}';
    """
INIT_INDICES_DISCOVERY_QUERY =  """
    SELECT indexname, tablename FROM pg_indexes WHERE tablename ='{}';
    """

class DBConn():
    def __init__(self):
        self.conn = None
        self.sql_flavor = "postgresql"
        # 
        #   "table_name": {
        #       "column_name":{
        #           "type": "<type>",
        #       }
        #   }
        # 
        self.table_objects = {}
        # 
        #   "index_name": {
        #       "table": "<table_name>",
        #       "columns": ["<column_name>"],
        #   }
        # 
        self.index_objects = {}
    
    def connect(self, host: str, dbname: str, user: str, password: str, sql_flavor: str = "postgresql") -> (bool, dict):
        conn_string = "dbname={0} user={1} password={2} host={3}".format(
            dbname,
            user,
            password,
            host
        )
        try:
            self.conn = psycopg2.connect(conn_string)
        except:
            return False, None
        self.sql_flavor = sql_flavor
        self.table_objects = self.initial_tables_discovery()
        self.index_objects = self.initial_indices_discovery()
        return True, {"tables": self.table_objects, "indices": self.index_objects}
    
    def execute_query(self, query: str) -> (list,tuple,bool):
        cursor = self.conn.cursor()
        try:
            cursor.execute(query)
        except Exception as e:
            print(e)
            self.conn.rollback()
            cursor.close()
            return None, None, False
        try:
            result = cursor.fetchall()
        except:
            result = None
        self.conn.commit()
        columns = cursor.description
        cursor.close()
        return result, columns, True
    
    def parseIfDDL(self,q: str):
        isDDL = False
        if CREATE_TABLE_CONST[0] in q and CREATE_TABLE_CONST[1] in q:
            print("CREATE TABLE")
            isDDL = True
        if ALTER_TABLE_CONST[0] in q and ALTER_TABLE_CONST[1] in q:
            print("ALTER TABLE")
            isDDL = True
        if DROP_TABLE_CONST[0] in q and DROP_TABLE_CONST[1] in q[q.index(DROP_TABLE_CONST[0]):]:
            print("DROP TABLE")
            isDDL = True
        if CREATE_INDEX_CONST[0] in q and CREATE_INDEX_CONST[1] in q:
            print("CREATE INDEX")
            isDDL = True
        if DROP_INDEX_CONST[0] in q and DROP_INDEX_CONST[1] in q[q.index(DROP_INDEX_CONST[0]):]:
            print("DROP INDEX")
            isDDL = True

        if isDDL:
            self.table_objects = self.initial_tables_discovery()
            self.index_objects = self.initial_indices_discovery()
            return {"tables": self.table_objects, "indices": self.index_objects}
        
        return None

    def initial_tables_discovery(self):
        tmp_tables = {}
        cursor = self.conn.cursor()
        cursor.execute(INIT_TABLES_DISCOVERY_QUERY)
        try:
            tables_results = cursor.fetchall()
        except:
            tables_results = None
        if tables_results is not None:
            for table in tables_results:
                cursor.execute(INIT_TABLE_SCHEMA_DISCOVERY_QUERY.format(table[0]))
                try:
                    schema_results = cursor.fetchall()
                except:
                    schema_results = None
                if schema_results is not None:
                    tmp_tables[table[0]] = {}
                    for column in schema_results:
                        tmp_tables[table[0]][column[0]] = {
                            "type": column[1]
                        }
        cursor.close()
        return tmp_tables

    def initial_indices_discovery(self):
        tmp_indices = {}
        cursor = self.conn.cursor()
        cursor.execute(INIT_TABLES_DISCOVERY_QUERY)
        try:
            tables_results = cursor.fetchall()
        except:
            tables_results = None
        if tables_results is not None:
            for table in tables_results:
                cursor.execute(INIT_INDICES_DISCOVERY_QUERY.format(table[0]))
                try:
                    indices_results = cursor.fetchall()
                except:
                    indices_results = None
                if indices_results is not None:
                    for index in indices_results:
                        tmp_indices[index[0]] = {
                            "table": index[1],
                            "columns": []
                        }
        cursor.close()
        return tmp_indices

def query_splitter(q):
    p = q.replace("(","").replace(")","").replace("\n"," ").replace(";","").replace("\r","").replace(",","")
    p = p.split(" ")
    return p