import json
import logging
import regex as re
from datetime import datetime
from typing import Callable, List, Dict, Tuple

from opensearchpy.exceptions import RequestError
from sentence_transformers import SentenceTransformer
from spacy import load
from text_to_num import alpha2digit

from server.utils import init_embedding_client, get_embeddings_client

from .models import BotAnswer, ConversationModel, ChatbotSentence
from data.models import Device


class ValuePattern:
    def __init__(self, regex_pattern: str, regex_method: Callable[[re.Match, str, Dict], str]):
        self.regex_pattern = regex_pattern
        self.regex_method = regex_method

class ChatbotAnalyser:
    def __init__(self):
        init_embedding_client()
        self.logger = logging.getLogger(self.__class__.__name__)
        self.nlp = load("fr_core_news_sm")
        self.es = get_embeddings_client()
        self.embedding_model = \
            SentenceTransformer("dangvantuan/sentence-camembert-large")
        self.REGEX_PATTERNS = {
            "MEMORY": ValuePattern(
                r"(([0-9]{1,2}\s+(([kmgtpe][bo])|octets))(\s+de\s+(ram|RAM|mémoire))?){1}",
                self.memory_value
            ),
            "CORES": ValuePattern(
                r"([0-9])+\s*([cC](oeur|ore|œur)s)?",
                self.cores_value
            ),
            "WINDOWS_OS": ValuePattern(
                r"windows\s+[0-9]{2}",
                self.os_value
            ),
            "MAC_OS": ValuePattern(
                r"(mac\s+)?os\s+x\s+[0-9]{2}\s+\.\s+[0-9]\s+",
                self.os_value
            ),
            "LINUX_OS": ValuePattern(
                r"ubuntu\s+[0-9]{2}\s+\.\s+[0-9]{2}\s+(lts)?\s+(\s[\w\s]+)?\b",
                self.os_value
            ),
            "PROCESSOR": ValuePattern(
                r"(processeur\s+)?((intel|amd)\s+(.)+)(\s|\.)?",
                self.processor_value
            )
        }

    def find_values(self, sentence: str) -> Tuple[str, Dict]:
        """
        For the sentence, find each value patterns according to the sentence
        """
        entities = {}
        sentence = alpha2digit(sentence, lang="fr")
        sentence = sentence.lower()
        for pattern in self.REGEX_PATTERNS.values():
            search_result = re.search(pattern.regex_pattern, sentence)
            while search_result:
                entities, sentence = pattern.regex_method(search_result, sentence, entities)
                search_result = re.search(pattern.regex_pattern, sentence)
        sentence, entities = self.replace_count(sentence, entities)
        return sentence, entities

    def replace_count(self, sentence: str, entities: List[Dict]):
        tokenized_sentence = []
        sentence = alpha2digit(sentence,"fr")
        sentence = re.sub(r"\bd[’']un(e)?\b", "d'{COUNT}",sentence, flags=re.IGNORECASE)
        if sentence.count("d'{COUNT}") > 0:
            entities["COUNT"] = []
            entities["COUNT"] += [1]*sentence.count("d'{COUNT}")
        for word in sentence.split(' '):
            try:
                digital_value = int(word)
                tokenized_sentence.append("{COUNT}")
                if "COUNT" not in entities:
                    entities["COUNT"] = []
                entities["COUNT"].append(digital_value)
            except ValueError as _:
                tokenized_sentence.append(word)
        return (' '.join(tokenized_sentence), entities)

    def replace_values(self, sentence: str, entities: List[Dict]):
        for pattern, regex_pattern in self.REGEX_PATTERNS.items():
            for match in re.find(regex_pattern, sentence):
                sentence = sentence[:match.start()] + \
                    "{VALUE}"+sentence[match.end():]
                entities.append({
                    "pattern": pattern,
                    "value": match
                })

    def memory_value(self, result: re.Match, sentence: str, entities: Dict) -> Tuple[Dict, str]:
        data_value = result.group(2)
        start_pos = result.start()
        end_pos = start_pos+len(data_value)
        sentence = sentence[:start_pos]+"{VALUE}"+sentence[end_pos:]
        if "memory" not in entities:
            entities["memory"] = []
        entities["memory"].append(data_value)
        return entities, sentence

    def cores_value(self, result: re.Match, sentence: str, entities: Dict) -> Tuple[Dict, str]:
        data_value = result.group(1)
        start_pos = result.start()
        end_pos = start_pos+len(data_value)
        sentence = sentence[:start_pos]+"{VALUE}"+sentence[end_pos:]
        if "cores" not in entities:
            entities["cores"] = []
        entities["cores"].append(data_value)
        return entities, sentence

    def os_value(self, result: re.Match, sentence: str, entities: Dict) -> Tuple[Dict, str]:
        data_value = result.group(0)
        start_pos = result.start()
        end_pos = result.end()
        sentence = sentence[:start_pos]+"{VALUE}"+sentence[end_pos:]
        if "cores" not in entities:
            entities["cores"] = []
        entities["os"].append(data_value)
        return entities, sentence

    def processor_value(self, result: re.Match, sentence: str, entities: Dict) -> Tuple[Dict, str]:
        data_value = result.group(0)
        start_pos = result.start()
        end_pos = result.end()
        if result.groups()[0] == 'processeur':
            start_pos += len("processeur ")
        sentence = sentence[:start_pos]+"{VALUE}"+sentence[end_pos:]
        entities["processor"] = data_value
        return entities, sentence

    def find_similar_sentence(self, model: SentenceTransformer, sentence: str) -> str:
        """ Find the most similar sentence action to the one asked by the user.
        :type model: SentenceTransformer
        :param model: Model used for the encodding

        :type sentence: str
        :param sentence: Sentence transformed into a template

        :raises: NotFoundError If the server doesn't know what the user is asking

        :rtype: str
        """
        embedding = model.encode(sentence, convert_to_tensor=True)
        res = self.es.search(
            index="embeddings",
            body = {
                "size": 1,
                "query": {
                    "knn": {
                        "embedding": {
                            "vector": embedding.tolist(),
                            "k": 1
                        }
                    }
                }
            }
        )
        if res["hits"]["hits"]:
            best_hit = res["hits"]["hits"][0]
            return best_hit['_source']['action']
        else:
            raise RequestError(404, "No action similar to the one asked.")

    def analyse_sentence(self,
                         sentence: str,
                         conversation: Tuple[ConversationModel | None] = None):
        templatized_sentence, entities = self.find_values(sentence)
        most_similar_sentence = self.find_similar_sentence(
            self.embedding_model, templatized_sentence)
        self.logger(f"Sentence found : {most_similar_sentence}")
        if most_similar_sentence["queries"].startswith("QUERY"):
            query_args = {}
            for query_arg in most_similar_sentence["queries"].split(", ")[1:]:
                self.logger.info(query_arg)
                op_type, data = query_arg.split(' ')
                data = data.lower()
                match(op_type):
                    case "<":
                        query_args[f"{data}gt"] = ""
                    case "<=":
                        query_args[f"{data}gte"] = ""
                    case ">":
                        query_args[f"{data}gt"] = ""
                    case ">=":
                        query_args[f"{data}gte"] = ""
                    case "!=":
                        query_args[f"~{data}gt"] = ""
                    case "between":
                        query_args[f"{data}gte"] = ""
                found_elements = Device.objects.filter(**query_args)
                if len(found_elements) == 0:
                    answer = {"tag": "NO FOUND DATA"}
                else:
                    answer = {"tag": "FOUND_ELEMENTS", "id": [
                        device.id for device in found_elements]}
                new_sentence = ChatbotSentence.add_new_sentence(
                    agent="AGENT",
                    text=answer,
                    conversation=conversation,
                    timestamp=datetime.now()
                )
                return BotAnswer.objects.create(
                    understood_data=json.dumps(query_args),
                    found_data=json.dumps(
                        [device.id for device in found_elements]),
                    answer=new_sentence
                )
