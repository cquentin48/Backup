import { JSX } from "react";

import { Avatar, Card, CardActionArea, CardContent, CardHeader, Typography } from "@mui/material";

interface ChatbotActionCard {
    title: string;
    description: string;
    icon: JSX.Element;
    avatarColor: string | number
}

export default function ChabotActionCard (props: ChatbotActionCard) {
    let avatar: JSX.Element;
    if (props.avatarColor != null && props.icon != null) {
        avatar = <Avatar sx={{ bgcolor: props.avatarColor }}>
            {props.icon}
        </Avatar>
    }
    avatar = undefined;
    return <Card sx={{ maxWidth: 345 }}>
        <CardActionArea onClick={()=>{console.log(`Click on ${props.title}`)}}>
            <CardHeader avatar={
                avatar
            }
                title={props.title}
            />
            <CardContent>
                <Typography variant="body2">
                    {props.description}
                </Typography>
            </CardContent>
        </CardActionArea>
    </Card>
}