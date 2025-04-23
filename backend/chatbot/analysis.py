from copy import deepcopy
import regex as re

from elasticsearch import Elasticsearch, NotFoundError
from typing import List, Dict, Tuple, Union

from sentence_transformers import SentenceTransformer
import spacy
from text_to_num import alpha2digit

REGEX_PATTERNS = {
    "MEMORY": r"([0-9]{1,2}\s+(([kmgtpeKMGTPE][bo])|octets)(\s+de\s+(ram|RAM|mémoire))?){1}",
    "CORES": r"([0-9]+\s*[cC](oeur|ore|œur)s?){1}",
    "COUNT": r"([0-9]+)"
}

DEVICE_TYPES = ["ordinateur", "laptop", "device", "portable", "smartphone"]

nlp = spacy.load("fr_core_news_sm")

# TODO: put every pattern into a for loop with the digitalized sentence before.


def find_os(sentence: str) -> Union[List[Dict], None]:
    """ Find OS data in the sentence (OS name, version and build).
    :type sentence: str
    :param sentence: Sentence tokenized

    :rtype: Union[List[Dict], None]
    """
    doc = list(nlp(sentence).sents)[0]
    root = doc.root
    entities = {}
    # Later use similarity between the device types and the value
    computer_tag = [token for token in root.children if token in DEVICE_TYPES]
    if len(computer_tag) == 0:
        return None
    computer_tag = computer_tag[0]
    os_name = [token for token in computer_tag.children if token.tag_ ==
               "NOUN" and token.text not in DEVICE_TYPES]
    if len(os_name) == 0:
        return None
    os_name = os_name[0]
    entities['os'] = os_name.text
    if len(list(os_name.children) != 0):
        entities['os'] = entities['os']+list(os_name.children)[0].text
    version = [token for token in doc if token.text == "version"]
    if len(version) == 0:
        return entities
    version_elements = list(version.children)
    version_number = [
        child for child in version_elements if child.tag_ == "NUM"]
    entities['version'] = version_number.text
    if len(version_number) == 0:
        return entities
    version_elements = deepcopy(version_elements)
    version_elements.remove(version_number)
    if len([token for token in version_elements if token.text == "build"]):
        build_version = [
            token for token in version_elements if token.tag_ == "NUM"]
        if len(build_version == 0):
            return entities
        entities['build'] = build_version[0].text
    return entities


def find_patterns(sentence: str):
    """
    For the sentence, find each patterns according to the sentence
    """
    found_patterns = {}
    for pattern, regex_pattern in REGEX_PATTERNS.items():
        found_pattern = re.search(regex_pattern, sentence)
        if found_pattern is not None:
            found_patterns[pattern] = {
                "value": found_pattern.value,
                "start": found_pattern.start(),
                "end": found_pattern.end()
            }
    return {
        k: v for k, v
        in sorted(
            found_patterns.items(),
            key=lambda item: (
                item[1]['start'],
                len(item[1]['value'])
            )
        )
    }


def templatize_sentence(sentence: str) -> Tuple[str, List[Dict]]:
    """ From a sentence, templatize it to find the most similar one to those
    stored in the elasticsearch database
    :type sentence: str
    :param sentence: Current sentence

    :rtype: Tuple[str, List[Dict]]
    """
    found_patterns = find_patterns(sentence)
    entities = []
    while (len(found_patterns) != 0):
        new_pattern = found_patterns.keys()[0]
        new_pattern_data = found_patterns[new_pattern]
        sentence = sentence[:new_pattern_data["start"]]+f"{{{new_pattern}}}" +\
            sentence[new_pattern_data["end"]:]
        entities.append({
            "type": new_pattern,
            "value": new_pattern_data["value"]
        })
    return sentence, entities


def replace_values(sentence: str, entities: List[Dict]):
    for pattern, regex_pattern in REGEX_PATTERNS.items():
        for match in re.find(regex_pattern, sentence):
            sentence = sentence[:match.start()] + \
                f"{{{pattern}}}"+sentence[match.end():]
            entities.append({
                "pattern": pattern,
                "value": match
            })


def find_similar_sentence(model: SentenceTransformer, sentence: str) -> str:
    """ Find the most similar sentence action to the one asked by the user.
    :type model: SentenceTransformer
    :param model: Model used for the encodding

    :type sentence: str
    :param sentence: Sentence transformed into a template

    :raises: NotFoundError If the server doesn't know what the user is asking

    :rtype: str
    """
    embeddings_sentence = model.encode(sentence, convert_to_tensor=True)
    es = Elasticsearch()
    res = es.search(
        index="sentence_embeddings",
        size=1,
        min_score=1.75,
        body={
            "query": {
                "script_score": {
                    "query": {"match_all": {}},
                    "script": {
                        "source": "cosineSimilarity(params.query_vectory, 'embedding')+1"
                    },
                    "params": {
                        "query_vector": embeddings_sentence
                    }
                }
            }
        }
    )
    if res["hits"]["hits"]:
        best_hit = res["hits"]["hits"][0]
        return best_hit['_source']['action']
    else:
        raise NotFoundError("No action similar to the one asked.")


def replace_count(sentence: str, entities: List[Dict]):
    sentence = alpha2digit(sentence).split(' ')
    tokenized_sentence = []
    for word in sentence:
        try:
            digital_value = int(word)
            tokenized_sentence.append("{COUNT}")
            entities.append({
                "pattern": "COUNT",
                "value": digital_value
            })
        except ValueError as _:
            tokenized_sentence.append(word)
    return ' '.join(tokenized_sentence)
