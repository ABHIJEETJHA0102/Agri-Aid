from fastapi import FastAPI, APIRouter, Query
from pydantic import BaseModel
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import PyPDFLoader, DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
import openai
import os
import time
from fastapi import File, UploadFile
import base64
import numpy as np
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.xception import preprocess_input
import tensorflow as tf
import sys
import matplotlib.image as mpimg
import warnings
warnings.filterwarnings("ignore")
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'  # Set TensorFlow logging level to suppress INFO messages
from io import BytesIO  # Import BytesIO from the io module
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

class QueryModel(BaseModel):
    sentence: str


app = FastAPI()
router = APIRouter()
# List of allowed origins (you can specify one or more domains)
origins = [
    "http://localhost",  # Allows localhost for development
    "http://localhost:3000",  # React or other frontend running on port 3000
    "http://localhost:5000",  # React or other frontend running on port 3000
    "http://127.0.0.1:8000",  # For localhost in some configurations
    "http://127.0.0.1",  # For localhost in some configurations
]

# Add CORS middleware to allow the specified origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows the listed origins to access the API
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Paths
DATA_PATH = 'books/'
DB_FAISS_PATH = '../scripts/chatbot/vectorstore/db_faiss'

# Load environment variables
def load_env_file(file_path):
    env_vars = {}
    with open(file_path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#'):
                key, value = line.split('=', 1)
                env_vars[key.strip()] = value.strip().strip('"').strip("'")
    return env_vars

env_vars = load_env_file('../.env')
openai.api_key = env_vars.get('Api_key')
model_id = 'gpt-3.5-turbo'

# Load embeddings and database
embeddings = HuggingFaceEmbeddings(model_name='sentence-transformers/all-MiniLM-L6-v2', model_kwargs={'device': 'cpu'})
db1 = FAISS.load_local(DB_FAISS_PATH, embeddings, allow_dangerous_deserialization=True)

# Retriever
retriever = db1.as_retriever(search_type="similarity", search_kwargs={'k': 100})

# Prompt template
prompt_template = """
### [INSTRUCTION]
You are "AgriAid", world's best farming assistant. you will be given a context for a plant which will contain plant
species, it's soil moisture, it's soil nitrogen, potassium, phosphorus values. The users would be asking different types of
agricultural decision making questions. You have to help them with queries.

{context}

### QUESTION:
{question}

[/INSTRUCTION]
"""

# Helper functions
def augment_prompt(query: str):
    results = db1.similarity_search(query, k=3)
    source_knowledge = "\n".join([x.page_content for x in results])
    augmented_prompt = f"""Using the contexts below, answer the query.

    Contexts:
    {source_knowledge}

    Query: {query}"""
    return augmented_prompt

def generate_prompt(context, question):
    prompt = prompt_template.format(context=context, question=question)
    return prompt

def generate_response(prompt):
    messages = [
        {"role": "system", "content": "You have good knowledge about crop management system."},
        {"role": "user", "content": prompt},
    ]
    response = openai.ChatCompletion.create(
        model=model_id,
        messages=messages,
        temperature=0.5,
        max_tokens=2500,
        top_p=1.0,
        frequency_penalty=0.0,
        presence_penalty=0.0
    )
    return response.choices[0].message["content"].strip()

# Define the model globally (loaded only once)
model = None

def load_model():
    global model
    base_model = tf.keras.applications.Xception(weights='imagenet', include_top=False, input_shape=(224, 224, 3), pooling='max')
    model = tf.keras.Sequential([
        base_model,
        tf.keras.layers.BatchNormalization(),
        tf.keras.layers.Dense(256, activation='relu'),
        tf.keras.layers.Dropout(0.5),
        tf.keras.layers.Dense(38, activation='softmax')
    ])
    model.load_weights("../scripts/weights.h5")

def process_image(image_data: bytes):
    """Process the uploaded image without saving it to a file."""
    img = image.load_img(BytesIO(image_data), target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = img_array / 255.0  # Normalize the image

    # Make prediction
    predictions = model.predict(img_array)
    predicted_class_index = np.argmax(predictions[0])

    # Class list (same as in `predict.py`)
    arr = ['Apple__Apple_scab', 'Apple_Black_rot', 'Apple_Cedar_apple_rust', 'Apple_healthy', 'Blueberry_healthy', 
           'Cherry(including_sour)__healthy', 'Cherry(including_sour)__Powdery_mildew', 'Corn(maize)__Cercospora_leaf_spot Gray_leaf_spot', 
           'Corn(maize)__Common_rust', 'Corn_(maize)__healthy', 'Corn(maize)__Northern_Leaf_Blight', 'Grape_Black_rot', 
           'Grape_Esca(Black_Measles)', 'Grape__healthy', 'Grape_Leaf_blight(Isariopsis_Leaf_Spot)', 'Orange__Haunglongbing(Citrus_greening)', 
           'Peach__Bacterial_spot', 'Peach_healthy', 'Pepper,_bell_Bacterial_spot', 'Pepper,_bell_healthy', 'Potato_Early_blight', 
           'Potato_healthy', 'Potato_Late_blight', 'Raspberry_healthy', 'Soybean_healthy', 'Squash_Powdery_mildew', 'Strawberry_healthy', 
           'Strawberry_Leaf_scorch', 'Tomato_Bacterial_spot', 'Tomato_Early_blight', 'Tomato_healthy', 'Tomato_Late_blight', 
           'Tomato_Leaf_Mold', 'Tomato_Septoria_leaf_spot', 'Tomato_Spider_mites Two-spotted_spider_mite', 'Tomato_Target_Spot', 
           'Tomato_Tomato_mosaic_virus', 'Tomato__Tomato_Yellow_Leaf_Curl_Virus']

    return arr[predicted_class_index]

def call_model2(result):
    """Call model2.py to process the prediction."""
    # Call the model2.py script with the result
    result_str = f"Provide treatment and prevention measure for this disease: {result}"
    start_time = time.time()
    context = augment_prompt(result_str)
    print(f"FAISS search time: {time.time() - start_time}s")

    start_time = time.time()
    prompt = generate_prompt(context, result_str)
    print(f"Prompt generation time: {time.time() - start_time}s")

    start_time = time.time()
    # print(prompt)
    response = generate_response(prompt)
    print(f"OpenAI API time: {time.time() - start_time}s")
    return response

# API Router
class QueryModel(BaseModel):
    sentence: str

# Warm-up call to OpenAI on startup to minimize cold start time
def warm_up_openai():
    openai.ChatCompletion.create(
        model=model_id,
        messages=[{"role": "system", "content": "Hello"}]
    )

@app.on_event("startup")
async def startup():
    warm_up_openai()


@router.get("/")
def read_root():
    return {"Hello": "World"}

response="haha"
@router.post("/query2")
def query_func(query:QueryModel):

    return {"response": response}
@router.post("/query")
async def query_endpoint(query: QueryModel):
    start_time = time.time()
    context = augment_prompt(query.sentence)
    print(f"FAISS search time: {time.time() - start_time}s")

    start_time = time.time()
    prompt = generate_prompt(context, query.sentence)
    print(f"Prompt generation time: {time.time() - start_time}s")

    start_time = time.time()
    # print(prompt)
    response = generate_response(prompt)
    print(f"OpenAI API time: {time.time() - start_time}s")

    # Remove the unwanted prefix if present
    clean_response = response.replace("### RESPONSE:", "").strip()
    print(clean_response)
    response=clean_response
    return {"response": clean_response}

@router.post("/upload_image/")
async def upload_image(file: UploadFile = File(...)):
    try:
        # Read image data
        image_data = await file.read()

        # Step 1: Process the image using the model
        result = process_image(image_data)

        # Step 2: Call model2.py for further processing
        result2 = call_model2(result)

        # Return the result
        return {"prediction": result, "treatment_info": result2}
    except Exception as e:
        return {"error": str(e)}

app.include_router(router)