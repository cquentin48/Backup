import os

from langchain.agents import initialize_agent, AgentType, Tool, create_sql_agent
from langchain.chains.llm import LLMChain
from langchain.memory import ConversationBufferMemory
from langchain.prompts import PromptTemplate
from langchain_ollama import OllamaLLM
from langchain_community.utilities.sql_database import SQLDatabase

from ..models import ConversationModel, Message
from .named_entity_recognition import NamedEntityRecognition

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
            self.init_text_generation_agent()
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
            
            Go correspond à une unité mémoire (Giga-octets).
            
            Si la valeur pour les éléments n'est pas présente dans la phrase, ne l'ajoute pas.
            N'ajoute pas de null dans le tableau.
            
            Réponds sous forme de liste JSON avec chaque attribut trouvé dans la question posée par l'utilisateur. Si tu ne trouve pas de données pour un élément ne l'ajoute pas.
            """
        )
        chain = LLMChain(
            llm=self.llm,
            prompt=template,
        )
        return Tool(
            name="llm_ner",
            func=lambda text: chain.invoke({"text":text})["text"],
            description="""
            Extraction d'entités à partir du text en utilisant un LLM. Répond sous forme de Liste.
            """
        )
       
    def fetch_object(self, question: str):
        parameters = NamedEntityRecognition.interpret_question(question)
        classes = {
            class_name: apps.get_model('data', class_name)
            for class_name
            in parameters['data_classes'].keys()
        }
        found_data = [
            list(classes[key].objects.filter(**res['data_classes'][key])) for key in classes
        ]
        obj_count = found_data['obj_type']['count']
        if 'Snapshot' in classes.keys():
            found_data['Snapshot'] = [snapshot.objects.filter(related_device__in = found_data['Device']) for snapshot in found_data["Snapshot"]]
        match parameters['objtype']['classname']:
            case 'Snapshot':
                snapshot_ids = [snapshot.id for snapshot in found_data['Snapshot']]
                if len(snapshot_ids) > count and count != -1:
                    return {
                        "status": {
                            "type":"error",
                            "msg": "NOT_ENOUGH_ELEMENTS"
                        },
                        ids : [snapshot_ids]
                    }
                else:
                    return {
                        "status": {
                            "type":"success",
                            "msg": "FOUND_EVERY_ELEMENTS"
                        },
                        ids : [snapshot_ids]
                    }
            case 'Device':
                related_devices = [snapshot.related_device for snapshot in found_data['Snapshot']]
                device_ids = list(set([related_device.id for related_device in related_devices]))
                if len(device_ids) > count and count != -1:
                    return {
                        "status": {
                            "type":"error",
                            "msg": "NOT_ENOUGH_ELEMENTS"
                        },
                        ids : [device_ids]
                    }
                else:
                    return {
                        "status": {
                            "type":"success",
                            "msg": "FOUND_EVERY_ELEMENTS"
                        },
                        ids : [device_ids]
                    }
        
        
    def init_text_generation_agent(self) -> Tool:
        """ Init the text generation agent.

        :rtype: Tool
        """
        template = PromptTemplate(
            """
            À partir des identifiants de modèles de {result},
            génère une réponse sous le format suivant :
            
            Dans notre premier exemple, la recherche sur un ordinateur se déroule comme prévu et l'ia trouve le nombre d'éléments correspondant. Un retour type serait par exemple ceci :
            {
                "status": "success",
                "message": "Après avoir réalisé une recherche, j'ai trouvé les ordinateurs n°1 et  n°2. Autre chose?"
            }
            
            
            En cas d'échec, tu dois garder la structure JSON et écrire comme ceci:
            Par exemple, si aucun id n'a été trouvé, tu peux dire ceci :
            
            {
                "status": "error",
                "message" : "Je suis désolé, je n'ai pas trouvé ce que vous recherchiez. Peut-être avez-vous fais une erreur dans votre recherche?"
            }
            
            Si le nombre d'éléments trouvés est inférieur à ce que l'utilisateur demande, tu peux écrire ceci (les éléments trouvés sont dans l'exemple un ordinateur avec comme id 1):
            
            {
                "status": "error",
                "message" : "Je suis désolé, je n'ai trouvé que l'ordinateur n°1. Peut-être avez-vous fais une erreur dans votre recherche?"
            }
            """
        )
        chain = LLMChain(
            llm=self.llm,
            prompt=template,
        )
        return Tool(
            name="llm_ner",
            func=lambda text: chain.invoke({"result":result})["text"],
            description="""
            Extraction d'entités à partir du text en utilisant un LLM. Répond sous forme de Liste.
            """
        ))
