import { EditSharp, RemoveSharp, SearchSharp } from "@mui/icons-material";
import { Box, Button, Paper, Typography } from "@mui/material";

import '../../../../../res/css/Chatbot.css';

export default function NewChatbotConversationText(){
    return(
        <Box>
            Bienvenu dans le chatbot conversationnel de Backup!
            <br/><br/><br/>
            Que souhaitez vous réaliser aujourd'hui?
            <Paper>
                <Typography variant="h4">Gestion d'équipements informatiques</Typography>
                <div className="chatbotActions">
                    <Button startIcon={<SearchSharp/>}>
                        Réaliser une recherche..
                    </Button>
                    <Button startIcon={<EditSharp/>}>
                        Mettre à jour des équipements
                    </Button>
                    <Button startIcon={<RemoveSharp/>}>
                        Supprimer des équipements
                    </Button>
                </div>
            </Paper>
        </Box>
    )
}