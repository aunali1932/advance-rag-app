from pydantic import BaseModel
# Define Pydantic models for request data
class SignupRequest(BaseModel):
    username: str
    password: str

class LoginRequest(BaseModel):
    username: str
    password: str

class ChatRequest(BaseModel):
    username: str
    technique_name: str

class QuestionRequest(BaseModel):
    username: str
    chat_id: int
    question: str
    
class ApiKeyRequest(BaseModel):
    api_key: str