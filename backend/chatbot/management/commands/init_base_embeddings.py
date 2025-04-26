import os

from django.core.management.base import BaseCommand
from sentence_transformers import SentenceTransformer
import numpy as np
import pandas as pd

from ...models import Sentence


class Command(BaseCommand):
    help = "Append sentences into the database"
    MODEL_NAME = "dangvantuan/sentence-camembert-large"
    embedding_model = SentenceTransformer(MODEL_NAME)
    
    def add_arguments(self, parser):
        parser.add_argument("--sentence_filepath", type=str, help="Sentence filepath")
    
    def handle(self, *args, **kwargs):
        if not kwargs['sentence_filepath'] and not kwargs['conditions_filepath']:
            raise AssertionError("⛔ No filepath given to add any element! Skipping operation.")
        try:
            if 'sentence_filepath' in kwargs and kwargs['sentence_filepath']:
                self.load_sentences(filepath=kwargs['sentence_filepath'])
        except ConnectionError as e:
            raise AssertionError("⛔ The elastic search database is currently unavailable!") from e
    
    def add_sentence(self, row:pd.Series):
        """ Add current condition to the dataframe
    
        :type row: Series
        :param row: Current condition data (``text`` and the ``type`` of condition)
        """
        _ = Sentence.add_element(
                embedding=row["embeddings"],
                sentence=row["sentence"],
                source="sentence",
                action=row["queries"],
                tags="QUERY",
                new_index=row.name
            )

    def load_sentences(self, filepath:str):
        """ Import sentences from file into the opensearch database
        :type filepath: str
        :param filepath: Path of the located file
        
        :type model: SentenceTransformer
        :param model: Model used to compute embeddings model

        :raises: FileNotFoundError -> Sentence file not found
        
        """
        if not filepath:
            raise AssertionError("⛔ A sentence file must be provided!")
        if not os.path.exists(filepath):
            raise FileNotFoundError(f"⛔ Sentence file {filepath} not found.")

        df = pd.read_json(filepath)
        embeddings = []
        for sentence in df["sentence"].values.tolist():
            embeddings.append(self.embedding_model.encode(sentence))
        df["embeddings"] = embeddings
        df.apply(lambda row: self.add_sentence(row), axis=1)
        
        print(f"✅ {len(df)} sentences added")