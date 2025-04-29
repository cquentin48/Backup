import os

from django.shortcuts import get_object_or_404

from langchain.agents import initialize_agent, AgentType, Tool
from langchain_experimental.sql.base import SQLDatabaseChain
from langchain.memory import ConversationBufferMemory
from langchain.prompts import PromptTemplate
from langchain_community.llms import Ollama
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
        self.llm = Ollama(
            base_url=os.environ.get("OLLAMA_URL", "http://ollama:11434"),
            model="llama3.1"
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
            Voici une question sur une base de données SQL. Si la question concerne une recherche sur un équipement informatique (ordinateur, smartphone, ...) génère une requête pour la table data_device.
            Voici à quoi correspond les attributs des composants :
            | Nom de l'attribut dans la table | Description |
            | ------------------------------- | ----------- |
            | id | Identifiant de l'objet |
            | name | Nom de l'ordinateur |
            | processor | Modèle du processeur |
            | cores | Nombre de coeurs |
            | memory | Mémoire vive stockée au format valeur + unité (e.g. 8 Go)|
            La mémoire doit garder sa valeur: ex. 4 Go doit rester 4 Go.
    
            Les questions de snapshots et de sauvegarde sont liées à la table repositories.
            Voici à quoi correspond les attributs des composants:
            | Nom de l'attribut dans la table | Description |
            | ------------------------------- | ----------- |
            | id | Identifiant de l'objet |
            | save_date | Date de création du snapshot |
            | related_device_id | Identifiant de l'appareil réalisant la sauvegarde |
            | repositories_list | List de tout répository (ignoré ici) |
            | Operating system | Nom du système d'exploitation |
            
            Toute question avec un notion de nombre lié aux objets présentés ci-haut doivent passer par une requête SQL.
            
            S'il s'agit d'une requête SQL, exécute là et génère une réponse au format texte.
            
            Sinon, retourne une réponse comme "Je ne peux pas répondre".
            
            Question: {question}
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
        sql_chain = SQLDatabaseChain(llm=self.llm, database=db, verbose=True)
        return Tool(
            name="Django database query managment",
            func=sql_chain.run,
            description="Manages the user database"
        )

    def ask_agent(self, user_input: str, session_id: int):
        """
        session = get_object_or_404(ConversationModel, id=session_id)
        _ = Message.objects.create(
            agent="USER",
            text=user_input,
            conversation=session
        )
        """
        prompt = self.sql_prompt.format(question=user_input)
        bot_response = self.agent.run(user_input)
