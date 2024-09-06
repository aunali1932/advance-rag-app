import sqlite3
from sqlite3 import Error

def create_connection(db_file):
    """ create a database connection to the SQLite database specified by db_file """
    conn = None
    try:
        conn = sqlite3.connect(db_file,check_same_thread=False)
        return conn
    except Error as e:
        print(e)
    return conn

def create_table(conn):
    try:
        sql_create_users_table = """ CREATE TABLE IF NOT EXISTS users (
                                        username TEXT PRIMARY KEY,
                                        password TEXT NOT NULL
                                    ); """
        cursor = conn.cursor()
        cursor.execute(sql_create_users_table)
    except Error as e:
        print(e)

