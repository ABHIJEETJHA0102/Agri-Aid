from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import PyPDFLoader, DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
import sys
#<-------------------------------------------------------------------------------------------------->
DATA_PATH = 'books/'  #Path containing my data
DB_FAISS_PATH = './routes/chatbot/vectorstore/db_faiss'  #Path where we store the embeddings of the data
#<-------------------------------------------------------------------------------------------------->
#Function for creating embeddings of my data
def create_vector_db():
    #Loading the data
    loader = DirectoryLoader(DATA_PATH,glob='*.pdf',loader_cls=PyPDFLoader)
    documents = loader.load()

    #Splitting the data
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500,chunk_overlap=50)
    texts = text_splitter.split_documents(documents)

    #Converting to embeddings using sentence transformer model
    embeddings = HuggingFaceEmbeddings(model_name='sentence-transformers/all-MiniLM-L6-v2',
                                       model_kwargs={'device': 'cpu'})
    db = FAISS.from_documents(texts, embeddings)

    #Saving the model
    db.save_local(DB_FAISS_PATH)

    #Returns the database
    return db
# #<-------------------------------------------------------------------------------------------------->
embeddings = HuggingFaceEmbeddings(model_name='sentence-transformers/all-MiniLM-L6-v2',
                                       model_kwargs={'device': 'cpu'})
db1 = FAISS.load_local(DB_FAISS_PATH,embeddings,allow_dangerous_deserialization=True)
# #<-------------------------------------------------------------------------------------------------->
#It checks similar content
retriever = db1.as_retriever(
   search_type="similarity",
   search_kwargs={'k': 100}
)
#<-------------------------------------------------------------------------------------------------->
#Query to ask from the database
query = sys.argv[1]
values = query.split()
species, soil_temp, pH_values, N_values, P_values, K_values, sm_values =values

#Fetching it from above
# docs = db1.similarity_search(query)
# print(docs[0].page_content)
# #<-------------------------------------------------------------------------------------------------->

def data_context(sm_values, N_values, pH_values, P_values,K_values,soil_temp,species):
    data_string = 'plant_Species'+str(species)+',Soil_temperature'+str(soil_temp)+',Soil Moisture'+str(sm_values) +',Nitrozen'+str(N_values) +',Phosphorus'+str(P_values)+',Potasium'+str(K_values)+',pH level'+str(pH_values)
    return data_string

    return data_string
def augment_prompt(query: str):
    # get top 3 results from knowledge base
    results = db1.similarity_search(query, k=10)
    # get the text from the results
    source_knowledge = "\n".join([x.page_content for x in results])
    # feed into an augmented prompt
    augmented_prompt = f"""Using the contexts below, answer the query.

    Contexts:
    {source_knowledge}

    Query: {query}"""
    return augmented_prompt
# #<-------------------------------------------------------------------------------------------------->

# print(augment_prompt(query))
# #<-------------------------------------------------------------------------------------------------->
#Importing Libraries
import transformers
from transformers import pipeline
import openai
# #<-------------------------------------------------------------------------------------------------->
# Loading the GPT-3.5 Turbo model
# openai.api_key = 'sk-proj-qIzYflKkszJgArMzdhBsT3BlbkFJUX4IEIJXAE6pPE7LcNhW'
# openai.api_key = 'sk-proj-EtlgxRNYT6mofFVptPsJT3BlbkFJSvTTJbCGiQzu7rJSQZr7'
# openai.api_key = 'sk-proj-bo02t2Yj2XXArbGBwLxGT3BlbkFJRwkEW7P5BKVZT2qnGHaO'
# openai.api_key = 'sk-proj-6aLwdr2OEKERDpBZGGzhT3BlbkFJj2AnbXtc5sPjD1x8B96W'
# openai.api_key = 'sk-proj-9P8vBnj9RnFrW9jJw3K0T3BlbkFJL3LcgQykM2zTfAp8VcmS'
# openai.api_key = 'sk-proj-GVQwf1An1027Ns4hseShT3BlbkFJAGjN9DXetAPxeWU6MnW3'
# openai.api_key = 'sk-proj-E7ywiv4r614sU7q37iJMT3BlbkFJvlflob4PRmGN0SHiHgwW'
openai.api_key = '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'

model_id = 'gpt-3.5-turbo'
# #<-------------------------------------------------------------------------------------------------->
# Generating template of prompt to give to my model
prompt_template = """
### [INSTRUCTION]
You are "AgriAid", world's best farming assistant. you will be given a context for a plant which will contain plant
species, it's soil moisture, it's soil nitrozen, potesium, phosphorus values. The users would asking different types of
agricultural decision making qestions. You have to help them with queries.

{context}

### QUESTION:
{question}

[/INSTRUCTION]
"""
# #<-------------------------------------------------------------------------------------------------->
# Create prompt from prompt template
def generate_prompt(context, question):
    prompt = prompt_template.format(context=context, question=question)
    return prompt

# #<-------------------------------------------------------------------------------------------------->

# Creating LLM chain
def generate_respons(prompt):
    # Create a list of messages
    messages = [
        {"role": "system", "content": "You have good knowledge about crop management system."},
        {"role": "user", "content": prompt},
    ]

    # Call the OpenAI API with the list of messages
    # client = openai(api_key='...')
    response = openai.chat.completions.create(
        model=model_id,
        messages=messages,
        temperature=0.5,
        max_tokens=2500,
        top_p=1.0,
        frequency_penalty=0.0,
        presence_penalty=0.0
    )

    # Return the text content of the response
    return response.choices[0].message.content.strip()
# #<-------------------------------------------------------------------------------------------------->
# Query to be asked

# Invoking query in pipeline
query2=data_context(sm_values, N_values, pH_values, P_values,K_values,soil_temp,species)
context = augment_prompt(query2)
prompt = generate_prompt(context, query)
response = generate_respons(prompt)
# Storing output text
output = response
print(output)