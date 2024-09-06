import hashlib

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def create_user(conn, username, password):
    sql = ''' INSERT INTO users(username,password)
              VALUES(?,?) '''
    cur = conn.cursor()
    cur.execute(sql, (username, hash_password(password)))
    conn.commit()
    return cur.lastrowid

def verify_user(conn, username, password):
    cur = conn.cursor()
    cur.execute("SELECT * FROM users WHERE username=? AND password=?", (username, hash_password(password)))
    rows = cur.fetchall()
    return len(rows) == 1
