import os

from django.core.management.base import BaseCommand
from elasticsearch_dsl.connections import connections
from sentence_transformers import SentenceTransformer

from tqdm import tqdm

from ...models import Sentence


class Command(BaseCommand):
    help = "Append sentences into the database"
    
    def add_arguments(self, parser):
        parser.add_argument("--filepath", type=str, help="Sentence filepath")
    
    def handle(self, *args, **kwargs):
        connections.create_connection(alias='default', hosts=['embeddings:9200'])
        if 'filepath' not in kwargs:
            raise AssertionError("⛔ A filepath must be provided!")
        embedding_model = self.load_model()
        self.load_sentences(embedding_model, kwargs['filepath'])
        
    def load_model(self):
        MODEL_NAME = "dangvantuan/sentence-camembert-large"
        return SentenceTransformer(MODEL_NAME)

    def load_sentences(self, model:SentenceTransformer, filepath:str):
        """ Import sentences from file into the elasticsearch database
        :type filepath: str
        :param filepath: Path of the located file
        
        :type model: SentenceTransformer
        :param model: Model used to compute embeddings model

        :raises: FileNotFoundError -> Sentence file not found
        
        """
        if not filepath:
            raise AssertionError("⛔ A file must be provided!")
        if not os.path.exists(filepath):
            raise FileNotFoundError(f"⛔ Sentence file {filepath} not found.")

        with open(filepath, "r",encoding="utf-8") as file:
            sentences = [line.replace('\n','') for line in file]

        for sentence in tqdm(
            sentences, total=len(sentences), desc="Sentence import",
            ncols=100, dynamic_ncols=True, leave=True, ascii=True
        ):
            embeddings = model.encode(sentence, convert_to_tensor=True)
            action="SELECT"
            if "a désormais" in sentence:
                action="UPDATE"
            elif "supprimer":
                action="DELETE"
            tags = "DEVICE"
            source=""
            new_input = Sentence(
                embeddings=embeddings.tolist(),
                sentence=sentence,
                source=source,
                action=action,
                tags=tags
            )
            new_input.save()
        
        print(f"✅ {len(sentences)} sentences added")