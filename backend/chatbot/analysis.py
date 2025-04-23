import regex as re

from typing import List, Dict

from text_to_num import alpha2digit

REGEX_PATTERNS = {
    "MEMORY": r"([0-9]{1,2}\s+(([kmgtpeKMGTPE][bo])|octets)(\s+de\s+(ram|RAM|mémoire))?){1}",
    "CORES": r"([0-9]+\s*[cC](oeur|ore|œur)s?){1}"
}

# TODO: put every pattern into a for loop with the digitalized sentence before.

def replace_values(sentence: str, entities: List[Dict]):
    for pattern, regex_pattern in REGEX_PATTERNS.items():
        for match in re.find(regex_pattern, sentence):
            sentence = sentence[:match.start()]+f"{{{pattern}}}"+sentence[match.end():]
            entities.append({
                "pattern": pattern,
                "value": match
            })

def replace_count(sentence:str, entities: List[Dict]):
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