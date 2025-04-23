import regex as re
from text_to_num import alpha2digit

REGEX_PATTERNS = {
    "MEMORY": r"([0-9]{1,2}\s+(([kmgtpeKMGTPE][bo])|octets)(\s+de\s+(ram|RAM|mémoire))?){1}",
    "CORES": r"([0-9]+\s*[cC](oeur|ore|œur)s?){1}"
}


def replace_values(sentence: str):
    for pattern, regex_pattern in REGEX_PATTERNS.items():
        for match in re.find(regex_pattern, sentence):
            sentence = sentence[:match.start()]+f"{{{pattern}}}"+sentence[match.end():]

def replace_count(sentence:str):
    sentence = alpha2digit(sentence).split(' ')
    tokenized_sentence = []
    for word in sentence:
        try:
            int(word)
            tokenized_sentence.append("{COUNT}")
        except ValueError as _:
            tokenized_sentence.append(word)
    return ' '.join(tokenized_sentence)