import { EditSharp, RemoveSharp, SearchSharp } from "@mui/icons-material";
import { Box, Button, Card, Paper, Typography } from "@mui/material";
import { mdiDevices } from "@mdi/js";
import Icon from "@mdi/react";

import '../../../../../res/css/Chatbot.css';
import ChabotActionCard from "./action";

export default function NewChatbotConversationText () {
    return (
        <Box>
            Bienvenu dans le chatbot conversationnel de Backup!
            <br /><br /><br />
            Que souhaitez vous réaliser aujourd'hui?

            <Typography variant="h5"><Icon path={mdiDevices} size={1}></Icon>Gestion d'équipements informatiques</Typography>
            <div className="chatbotActions">
                <ChabotActionCard
                    avatarColor="white"
                    title="Recherche"
                    description="Réalise une recherche parmi les équipements stockés..."
                    icon={<SearchSharp/>}
                />
                <ChabotActionCard
                    avatarColor="#FFB74D"
                    title="Mise à jour"
                    description="Met à jour d'équipements en fonction de conditions spécifiées..."
                    icon={<EditSharp/>}/>
                <ChabotActionCard
                    avatarColor="#E57373"
                    title="Suppression d'équipements"
                    description="Suppression d'équipements en fonction de conditions spécifiées..."
                    icon={<RemoveSharp />}/>
            </div>
        </Box>
    )
}