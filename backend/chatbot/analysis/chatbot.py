import json
from json.decoder import JSONDecodeError

import logging
import os

from itertools import product

from django.apps import apps

from langchain.agents import initialize_agent, AgentType, Tool, create_sql_agent
from langchain.chains.llm import LLMChain
from langchain.memory import ConversationBufferMemory
from langchain.prompts import PromptTemplate
from langchain_core.runnables import RunnableSequence
from langchain_ollama import OllamaLLM

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
        self.logger = logging.getLogger("ChabotAgent")
        self.llm = OllamaLLM(
            base_url=os.environ.get("OLLAMA_URL", "http://ollama:11434"),
            model="mistral"
        )
        self.tools = {
            "question_analysis": self.init_question_interpretation(),
            "ner": self.init_ner_agent(),
            "text_generation": self.init_text_generation_agent(),
        }

        
    def init_question_interpretation(self) -> RunnableSequence:
        """ Init the Question interpretation agent.

        :rtype: RunnableSequence
        """
        prompt = PromptTemplate(
            template = """
            Tâche: à partir de la question, analyser l'intention de l'utilisateur (recherche, mise à jour, suppression ou création d'objets).
            Récupérer aussi le nombre d'éléments et le type de données parmi la liste suivante:
            
            | Type de données | Nom de la donnée |
            | --------------- | ---------------- |
            | Équipement informatique (ordinateur, ordinateur portable, serveur) | Device |
            | Sauvegarde informatique | Snapshot |
            
            En fonction du type de données, prends le nom associé dans la colonne `Nom de la donnée` pour la variable `dataType`.
            
            Le type de donnée récupérée doit être 
            
            L'intention doit être parmi la liste suivante :
            | Type de requête | Nom de la requête |
            | --------------- | ----------------- |
            | Création de données | CREATE |
            | Recherche | SELECT |
            | Mise à jour | UDPATE |
            | Supression de données | DELETE |
            
            En fonction du type de requête, prends le nom de la requête associé pour le type de données pour la variable `dataType`.
            
            `objectCount` correspond au nombre d'objets sur lequel la question va travailler. Par exemple : Quel ordinateur a plus de 8 Go de RAM? va retourner 1 comme objectCount. Si l'utilisateur pose une question sur tous les objet du type de données, associe -1 à la variable.
            
            Entrée:
            - question posée : {question}
            
            Une fois tout trouvé retourner les données dans un dictionnaire JSON au format suivant :
            ```json
            {{
                "intention":[...],
                "dataType":[...],
                "objectCount":[...]
            }}
            ```
            
            Retourne uniquement le dictionnaire JSON (sans les ```json), juste le dictionnaire.
            """
        )
        chain = RunnableSequence(
            first=prompt,
            last=self.llm,
        )
        return chain
        
    def init_ner_agent(self) -> RunnableSequence:
        """ Init the ner chain agent
        :rtype: Runnable sequence
        """
        prompt = PromptTemplate(
            input_variables=["text"],
            template = """
            Tâche: Extraire les entités suivantes du texte : mémoire vive, système d'exploitation, nombre de coeurs du processeur, modèle du processeur, nom de la machine.

            Génère ensuite un dictionnaire JSON utilisé pour les queries de modèle Django.

            Converti la mémoire au format float. Par exemple : 1 Go devient 1.00, 8 Go devient 8.00, 4 Mo devient .004 .

            Voici la correspondance des éléments:
            | Type de données | Nom de l'attribut |
            | --------------- | ----------------- |
            | Mémoire vive | memory |
            | Nombre de coeurs | cores |
            | Nom de l'ordinateur | name |
            | Modèle du processeur | processor |

            Ajoute aussi le type de condition (inférieur, supérieur, inférieur ou égal, ...).
            Voici la liste des conditions:
            | Type de condition              | Suffixe attendu  |
            | ------------------------------ | ---------------- |
            | Infériorité                    | __lt             |
            | Supériorité                    | __gt             |
            | Infériorité ou égalité         | __lte            |
            | Supériorité ou égalité         | __gte            |
            | Egalité                        | __eq             |
            | Différence                     | __ne             |
            | Dans une plage de valeurs      | __in             |
            | Absente de la plage de valeurs | __nin            |
            
            Par exemple si l'utilisateur demande "Quel ordinateur a plus de 8 Go?", tu devrais retourner ceci :
            ```json
            {{
                "memory__gt": 8  
            }}
            ```

            Entrée :
            - Question posée: {question}

            Chaque élément du dictionnaire JSON a pour index le nom de l'attribut avec le suffix attendu à la fin et la valeur en tant que donnée. Tous les éléments doivent être dans le même dictionnaire JSON, ne mets pas d'arrays dedans.

            Commence ta réponse directement par [ ou {{ et termine la par }} ou ], pas de commentaire, juste le tableau JSON, ne mets pas non plus de ```json.
            """
        )
        chain = RunnableSequence(first=prompt, last=self.llm)
        return chain


    def init_text_generation_agent(self) -> RunnableSequence:
        """ Init the text generation agent.

        :rtype: RunnableSequence
        """
        prompt = PromptTemplate(
            template = """
            Tu es un assistant conversationnel qui doit répondre de manière naturel à l'utilisateur selon des résultats ont été trouvés ou non. L'opération a été réalisé sur des recherches d'ordinateur dans une base de données.

            Le style doit être professionnel, empathique et varié. Génère des réponses légèrement différentes à chaque fois (en français).

            En entrée, il y a le status stocké dans la variable `status`. De plus, une liste d'identifiants est stocké dans la variable `ids`.

            Voici la liste des status présent dans la donnée status (dans le tableau, clé est associé à un identifiant passé par la liste des identifiants ``ids``):
            | Nom | Type de status | Type de réponse générée |
            | SUCCESS | Opération réussie | Phrase positive (variée et naturelle) et affichage la liste des IDS avec des balises sous la forme <id>clé</id>.
            | NOT_ENOUGH_ELEMENTS | Pas assez d'éléments | Phrase négative indiquant que tout n'a pas été trouvé, mais qu'une partie, échec de recherche ou problème dans l'opération. La phrase doit inclure la liste d'identifiant sous forme de hashtag <id>id/<id>
            | NOTHING_FOUND | Pas assez d'éléments trouvés | Phrase négative expliquant que la recherche à échouée, ou quelque chose s'est mal passé.

            Entrée :
            Statut : {status}
            Identifiants : {ids}

            La réponse générée et retournée doit ressembler à ceci :
            {{
                status,
                generated_response
            }}
            """
        )
        chain = RunnableSequence(
            first=prompt,
            last=self.llm,
        )
        return chain
    
    
    
    def has_ner_gotten_the_data(self, ner_result: str, model_name: str) -> bool:
        """ Check if the entities had been correctly seeked.
        :type ner_result: str
        :param ner_result: Result of the named entity recognition agent

        :type model_name: str
        :param model_name: Name of the related Django model

        :rtype: bool
        """
        try:
            data = json.loads(ner_result)
            Model = apps.get_model('data', model_name)
            fields = [field.column for field in Model._meta.fields]
            suffixes = ['eq','ne','gt','gte','lt','lte','in','nin','contains','startswith','endswith','isnull','notnull','regex']
            input_fields = list(product(fields, suffixes))
            input_fields = [f"{field}__{suffix}" for field, suffix in input_fields]
            return len([element for element in data.keys() if element not in input_fields]) > 0
        except JSONDecodeError as _:
            return False

       
    def interpret_question(self, question: str):
        try:
            models = [model.__name__ for model in apps.get_app_config('data').get_models()]
            question_data = json.loads(self.tools["question_analysis"].invoke({"question":question}).replace("\n",""))
            self.logger.debug(question_data)
            
            ModelClass = [apps.get_model('data', model) for model in question_data['dataType']]
            while len(ModelClass) != 1 and ModelClass[0] not in models:
                question_data = json.loads(self.tools["question_analysis"].invoke({"question":question}).replace("\n",""))
                ModelClass = [apps.get_model('data', model) for model in question_data['dataType']]
            
            ModelClass = ModelClass[0]
            
            ner_data = self.tools["ner"].invoke({"question":question}).replace("\n","")
            while self.has_ner_gotten_the_data(ner_data, ModelClass.__name__):
                ner_data = self.tools["ner"].invoke({"question":question}).replace("\n","")
            ner_data = json.loads(ner_data)
            ner_data = {k:v for k,v in ner_data.items() if v}
            
            result = ModelClass.objects.filter(**ner_data)
            
            expected_ids = question_data["objectCount"]
            expected_ids = int(expected_ids)
            
            ids = [object.id for object in result]
            if len(ids) == expected_ids:
                return self.tools["text_generation"].invoke({
                    "status":"SUCCESS",
                    "ids":[ids]
                })
            else:
                return self.tools["text_generation"].invoke({
                    "status":"NOT_ENOUGH_ELEMENTS",
                    "ids":[ids]
                })
            
        except (JSONDecodeError, AttributeError, LookupError) as e:
            self.logger.error(e)
            return self.tools["text_generation"].invoke({"status":"NOTHING_FOUND","ids":[]})