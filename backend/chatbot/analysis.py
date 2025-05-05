import os

from langchain.agents import initialize_agent, AgentType, Tool, create_sql_agent
from langchain.chains.llm import LLMChain
from langchain.memory import ConversationBufferMemory
from langchain.prompts import PromptTemplate
from langchain_ollama import OllamaLLM
from langchain_community.utilities.sql_database import SQLDatabase

from .models import ConversationModel, Message


def singleton(class__):
    instances = {}

    def getinstance(*args, **kwargs):
        if class__ not in instances:
            instances[class__] = class__(*args, **kwargs)
        return instances[class__]
    return getinstance


@singleton
class ChatbotAgent:
    def __init__(self):
        self.llm = OllamaLLM(
            base_url=os.environ.get("OLLAMA_URL", "http://ollama:11434"),
            model="mistral"
        )
        tools = [
            self.init_sql_agent()
        ]
        self.agent = initialize_agent(
            tools=tools,
            llm=self.llm,
            agent=AgentType.CONVERSATIONAL_REACT_DESCRIPTION,
            memory=ConversationBufferMemory(
                memory_key="chat_history", return_messages=True
            ),
            verbose=True
        )
        self.sql_prompt = PromptTemplate(
            input_variables=["question"],
            template="""
            Tu es un agent SQL chargé de réaliser des requêtes sur des tables SQL.
            Les données des ordinateurs sont stockées dans une table nommée data_device.
            La taille mémoire est au format float.
            
            Utilise uniquement les informations de la base de données.
            
            Question: {question}
            """
        )
        
    def init_ner_agent(self):
        template = PromptTemplate(
            input_variables=["text"],
            template="""
            Identifie les entités nommées dans ce texte : {text}.

            Les éléments à identifier sont les suivants :
            | Type de données | Libellée | Entrée à ajouter dans le tableau retourné |
            | --------------- | -------- | ----------------------------------------- |
            | Mémoire vive | La RAM présente dans la machine | memory |
            | Nombre de coeurs | Le nombre de coeurs dans la machine | cores |
            | Processeur | Modèle de processeur | processor |
            | Système d'exploitation | Le système d'exploitation présent sur la machine | os |
            
            Go correctement à une unité mémoire (Giga-octets).
            
            La phrase "Quel ordinateur a plus de 8 Go, 4 coeurs et Windows comme OS?" doit retourner :
            ```json
            {{
                "memory": 8.00,
                "cores": 4,
                "os": "windows"
            }}
            ```
            
            Si la valeur pour les éléments n'est pas présente dans la phrase, ne l'ajoute pas.
            N'ajoute pas de null dans le tableau.
            
            Réponds sous forme de liste JSON.
            """
        )
        chain = LLMChain(
            llm=self.llm,
            prompt=template,
        )
        return Tool(
            name="llm_ner",
            func=lambda text: chain.run(text),
            description="""
            Extraction d'entités à partir du text en utilisant un LLM. Répond sous forme de Liste.
            """
        )
        

    def init_sql_agent(self) -> Tool:
        """ Init the SQL query agent for the chatbot.

        :rtype: Tool
        """
        db_name = os.environ.get('POSTGRES_DB')
        db_username = os.environ.get('POSTGRES_USER')
        db_password = os.environ.get('POSTGRES_PASSWORD')
        db_host = os.environ.get('DB_HOST', 'localhost')
        db_uri = f"postgresql+psycopg2://{db_username}:{db_password}@{db_host}/{db_name}"
        db = SQLDatabase.from_uri(db_uri)
        sql_chain = create_sql_agent(
            llm=self.llm,
            db=db,
            agent_type="zero-shot-react-description",
            verbose=True
        )
        return Tool(
            name="Django database query managment",
            func=sql_chain.run,
            description="Manages the user database"
        )

    def ask_agent(self, user_input: str, session_id: int):
        prompt = self.sql_prompt.format(question=user_input)
        bot_response = self.agent.invoke({"input":user_input})
