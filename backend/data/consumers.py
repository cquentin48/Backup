from channels.generic.websocket import WebsocketConsumer

class BackupImportConsumer(WebsocketConsumer):
    def connect(self):
        # TODO: check if the user has a valid token
        self.accept()
        self.send("Connected!")
    
    def receive(self, text_data=None, bytes_data=None):
        print(text_data)
        self.send(text_data=text_data)