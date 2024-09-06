from fastapi import FastAPI, UploadFile, File, Depends, HTTPException, Response, Cookie
from pydantic import BaseModel
from auth import create_user, verify_user
from database import *
from itsdangerous import Signer, BadSignature
from fastapi.middleware.cors import CORSMiddleware
import os
from schemas import *

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Or the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Secret key for signing session cookies
SECRET_KEY = "your-secret-key"  # Replace with a strong, secure key
signer = Signer(SECRET_KEY)

# Database connection setup
DATABASE_PATH = "./advance-rag-app/advance-rag-backend/users.db"

def get_db():
    # Create a connection to the database
    conn = create_connection('users.db')
    if conn is not None:
        create_table(conn)
    try:
        yield conn
    finally:
        # Close the connection after the request is done
        conn.close()

# User signup
@app.post("/signup")
def signup(request: SignupRequest, db=Depends(get_db)):
    if len(request.username) < 6 or len(request.password) < 6:
        raise HTTPException(status_code=400, detail="Username and password must be at least 6 characters long.")
    
    if not create_user(db, request.username, request.password):
        raise HTTPException(status_code=400, detail="Failed to create account. Try a different username.")
    
    return {"message": "Account created successfully!"}

# User Login
@app.post("/login")
def login(request: LoginRequest, response: Response, db=Depends(get_db)):
    if not verify_user(db, request.username, request.password):
        raise HTTPException(status_code=400, detail="Incorrect username or password.")
    
    # Generate a session token (signed)
    session_token = signer.sign(request.username).decode()
    
    # Set the session token in a cookie
    response.set_cookie(key="session", value=session_token, httponly=True,secure=False)
    #response.set_cookie(key="fakesession", value="fake-cookie-session-value")
    return {"message": f"Logged in as {request.username}"}


# Create a new chat with PDF processing
@app.post("/chat")
async def chat(request: ChatRequest, file: UploadFile = File(...)):
    #extracted_data = load_pdf(file)
    #full_text = "".join(page['page_content'] for page in extracted_data)

    

    # Save the vectorstore (simulated)
    vectorstore_dir = f'vectorstores/{request.username}/{pdf_id}'
    os.makedirs(vectorstore_dir, exist_ok=True)
    
    # Here you'd save the vectorstore and PDF content to disk (omitted for brevity)

    return 0


# User logout
@app.post("/logout")
def logout(response: Response):
    # Clear the session cookie
    response.delete_cookie("session")
    return {"message": "Successfully logged out"}

from fastapi import Request
# Retrieve user from session
def get_current_user(request: Request, session: str = Cookie(None)):
    print(f"Received cookies: {request.cookies}")
    if "session" not in request.cookies or session is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    
    try:
        # Verify and retrieve the username from the signed session token
        username = signer.unsign(session).decode()
        return username
    except BadSignature:
        raise HTTPException(status_code=401, detail="Invalid session token")

# Example endpoint for authenticated users only
@app.get("/protected")
def protected_route(username: str = Depends(get_current_user)):
    return {"message": f"Hello, {username}. You are authenticated!"}





