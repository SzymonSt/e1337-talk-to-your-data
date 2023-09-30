import sqlite3
from sqlite3 import Error

def create_connection(db_file):
    """ create a database connection to a SQLite database """
    conn = None;
    try:
        conn = sqlite3.connect(db_file)
        print(f"Successfully connected to SQLite version: {sqlite3.version}")
    except Error as e:
        print(e)
    finally:
        return conn
