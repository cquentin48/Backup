import re

from typing import Dict, Union

import spacy
from spacy.language import Language
from spacy.tokens import Span
from spacy.tokens.doc import Doc

from text_to_num import alpha2digit

type_definitions = {
    "device": ["ordinateur", "ordinateur portable", "nas", "téléphone", "smartphone", "laptop"],
    "os_label": ["l'os", "un os", "le système d'exploitation"],
    "processor": ["processeur", "modèle de processeur", "processor"],
    ">": ["plus", "bien plus"],
    ">=": ["au moins", "plus grand que"],
    "<": ["moins", "bien moins", "plus petit que"],
    "<=": ["jusqu'à", "pas plus grand que"],
    "==": ["égal à", "exactement", "avec"],
    "!=": ["différent", "pas égal à"],
    "name": ["nom", "name", "hostname"],
    "delete": ["enlever", "supprimer"],
    "update": ["mettre à jour", "modifier"],
    "select": ["rechercher"]
}

class NamedEntityRecognition:
    nlp = spacy.load("fr_core_news_lg")
    
    Span.set_extension("query_label", default="")
    Span.set_extension("type", default="")
    Span.set_extension("data", default={})
    Span.set_extension("related_class", default="")
    Doc.set_extension("custom_entities", default=None, force=True)

    @staticmethod
    def interpret_question(sentence: str)->Dict:
        cleaned_sentence = NamedEntityRecognition.clean_sentence(sentence)
        parsed_sentence = NamedEntityRecognition.nlp(cleaned_sentence)
        found_elements = {'data_classes':{}}
        for element in parsed_sentence._.custom_entities:
            label = element._.query_label
            if label == 'obj_type':
                found_elements['obj_type'] = {
                    'classname': element._.data['className'],
                    'count': element._.data['count']
                }
            elif label != 'obj_type':
                class_type = element._.related_class
                if class_type not in found_elements['data_classes']:
                    found_elements['data_classes'][class_type] = {}
                class_index = found_elements['data_classes'][class_type]
                if label not in found_elements:
                    class_index[f"{label}__in"] = []
                value_index = class_index[f"{label}__in"]
                element_value = None
                match element._.type:
                    case "int":
                        element_value = int(element.text)
                    case "float":
                        element_value = float(element.text)
                    case "str" | _ :
                        element_value = element.text
                value_index.append(element_value)
        return found_elements

    @staticmethod
    def detect_memory_chunk(span: Span, doc: Doc):
        units = ['octets', 'ko', 'mo', 'go', 'to']
        pattern = r"([0-9]+(\.[0-9])?(\s*((k|m|g|t)(b|o))|(bytes|octets)?))"
        start = span.start
        i = 0
        while i < span.end and span[i].tag_ == "PUNCT":
            i += 1
        search_result = re.search(pattern, span.text)
        if search_result:
            for unit in units:
                if unit in search_result.group(0):
                    i = 0
                    while span[i].tag_ == "PUNCT":
                        i+= 1
                    end = span.end
                    if span[-1].text in units:
                        end -= 1
                    span = Span(doc, start+i, end, label="QV")
                    span._.query_label = "memory"
                    span._.related_class = "Device"
                    span._.type = "float"
                    return span
        return None

    @staticmethod
    def detect_cores_chunk(span: Span, doc: Doc):
        suffixes = ['cores', 'core', 'coeur', 'coeurs', 'cœur', 'cœurs']
        for suffix in suffixes:
            if suffix in span.text:
                i = 0
                while span[i].tag_ == "PUNCT":
                    i+= 1
                span = Span(doc, span.start+i, span.end-1, label="QV")
                span._.query_label = "cores"
                span._.related_class = "Device"
                span._.type = "int"
                return span
        return None
    
    @staticmethod
    def detect_query_object(span: Span, doc: Doc) -> Union[None|Span]:
        device_type = type_vectors["device"]
        i = 0
        while span[i].tag_ == "NUM":
            i += 1
        similarities = [span[i:].similarity(ref) for ref in device_type]
        similarities = sorted([res for res in similarities if res >= .67])
        if len(similarities) == 0:
            return None
        print(list(span))
        print(i)
        count = int(span[:i].text)
        updated_span = Span(doc, span.start+i, span.end, label="QOT")
        updated_span._.query_label = "obj_type"
        updated_span._.type = "str"
        updated_span._.data = {"count": count, "className": "Device"}
        return updated_span

    @staticmethod
    def detect_os(doc: Doc, start_pos: int) -> Union[Span | None]:
        os_begin_tag = ['PRON', 'NOUN']
        os_label_vectors = type_vectors['os_label']
        similarities = []
        found = False
        new_start_pos = start_pos
        for i in range(start_pos, len(doc)):
            similarities = [doc[i].similarity(os_label) for os_label in os_label_vectors]
            similarities = sorted([similarity for similarity in similarities if similarity >= .67])
            if doc[i].tag_ in os_begin_tag and len(similarities) > 0:
                new_start_pos = i
                found = True
                break
        if not found:
            return None
        end_pos = new_start_pos
        os_end_tag = ['ADP', 'CCONJ', 'PUNCT']
        while doc[end_pos].tag_ not in os_end_tag and end_pos < len(doc):
            end_pos += 1
        span = Span(doc, new_start_pos, end_pos, label="QV")
        span._.query_label = "os"
        span._.related_class = "Snapshot"
        span._.type = "str"
        return span

    @staticmethod
    def detect_name(doc: Doc, start_pos: int) -> Union[Span | None]:
        name_begin_tag = ['PRON', 'NOUN']
        name_label_vectors = type_vectors['name']
        new_start_pos = start_pos
        found = False
        similarities = []
        for i in range(start_pos, len(doc)):
            similarities = [doc[i].similarity(label) for label in name_label_vectors]
            similarities = sorted([similarity for similarity in similarities if similarity >= .67])
            if doc[i].tag_ in name_begin_tag and len(similarities) > 0:
                new_start_pos = i
                found = True
                break
        if not found:
            return None
        end_pos = new_start_pos
        end_tag = ['ADP', 'CCONJ', 'PUNCT']
        while doc[end_pos].tag_ not in end_tag and end_pos < len(doc):
            end_pos += 1
        span = Span(doc, new_start_pos, end_pos, label="QV")
        span._.query_label = "name"
        span._.related_class = "Device"
        span._.type = "str"
        return span


    def detect_processor_model(doc: Doc):
        processor_models = []  # Replace it here with the processor list from kaggle
        for model in processor_models:
            model_doc = NamedEntityRecognition.nlp(model)
            try:
                start_pos = list(doc).index(model_doc[0])
                identic = True
                for i in range(len(model_doc)):
                    if doc[start_pos+i].text != model_doc[i].text:
                        identic = False
                        break
                if identic:
                    span = Span(doc, start_pos, start_pos +
                                i, label="PROCESSOR_VALUE")
                    span._.type = "str"
                    span._.related_class = "Device"
                    return span
            except ValueError as _:
                break

    @Language.component("extract_entities")
    def extract_entities(doc: Doc):
        i = 0
        spans = []
        no_span_entities = [
            NamedEntityRecognition.detect_os,
            NamedEntityRecognition.detect_name
        ]
        while i < len(doc):
            for entity_detection in no_span_entities:
                found_value = entity_detection(doc, i)
                if found_value:
                    spans.append(found_value)
                    i += found_value.end
                else:
                    i += 1
        span_entities = [
            NamedEntityRecognition.detect_cores_chunk,
            NamedEntityRecognition.detect_memory_chunk,
            NamedEntityRecognition.detect_query_object
        ]
        for chunk in doc.noun_chunks:
            for entity_detection in span_entities:
                custom_entity = entity_detection(chunk, doc)
                if custom_entity:
                    spans.append(custom_entity)
        doc._.custom_entities = spans
        return doc


    def clean_sentence(sentence: str):
        sentence = sentence.lower()
        sentence = alpha2digit(sentence, lang="fr", ordinal_threshold=None)
        remaining_number_pattern = r'\b(un|une)\b(?=\s*[.!?,;\s])'
        sentence = re.sub(remaining_number_pattern, '1', sentence)
        return sentence

type_vectors = {
    type_name: [NamedEntityRecognition.nlp(phrase) for phrase in phrases]
    for type_name, phrases in type_definitions.items()
}

NamedEntityRecognition.nlp.add_pipe(
    factory_name="extract_entities",
    last=True
)