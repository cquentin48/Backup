import React, { type JSX } from "react";

import { Avatar, Card, CardActionArea, CardContent, CardHeader, Typography } from "@mui/material";

/**
 * Question card data
 */
interface ChatbotActionCard {
    /**
     * Question title
     */
    title: string

    /**
     * Question description
     */
    description: string

    /**
     * Question icon
     */
    icon: JSX.Element

    /**
     * Question icon color
     */
    avatarColor: string | number
}

/**
 * Exemple question set in the dialog at the beginning
 * @param {ChatbotActionCard} props Question data
 * @returns {React.JSX.Element} Rendered DOM component
 */
export default function ChabotActionCard (props: ChatbotActionCard): React.JSX.Element {
    let avatar: JSX.Element | undefined;
    if (props.avatarColor != null && props.icon != null) {
        avatar = <Avatar sx={{ bgcolor: props.avatarColor }}>
            {props.icon}
        </Avatar>
    }
    avatar = undefined;
    return <Card sx={{ maxWidth: 345 }}>
        <CardActionArea onClick={() => { console.log(`Click on ${props.title}`) }}>
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
