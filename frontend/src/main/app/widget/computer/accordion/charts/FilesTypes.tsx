import { mdiFileOutline, mdiFilterOutline, mdiPlus } from "@mdi/js";
import Icon from "@mdi/react";

import { Avatar, Card, CardContent, CardHeader, IconButton, Menu, MenuItem, Switch, TextField } from "@mui/material";
import { PieChart } from "@mui/x-charts";
import React from "react";

export default function FilesTypes() {

    const [anchorEl, setanchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setanchorEl(event.currentTarget);
    }
    const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
        setanchorEl(null);
    }

    return (
        <Card sx={{ width: "fit-content" }}>
            <CardHeader
                avatar={
                    <Avatar
                        sx={{ bgcolor: "#c2c2c2" }}
                        arial-labels="recipe">
                        <Icon path={mdiFileOutline} size={1} />
                    </Avatar>
                }
                title="Types of files"
                action={
                    <IconButton
                        aria-label="settings"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}>
                        <Icon path={mdiFilterOutline} size={1} />
                        <Menu
                            id="file-types-filter-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button'
                            }}
                        >
                            <MenuItem>
                                No filter added.
                                <IconButton>
                                    <Icon path={mdiPlus} size={1}/>
                                </IconButton>
                            </MenuItem>
                        </Menu>
                    </IconButton>
                }
            />
            <CardContent>
                <PieChart
                    series={[
                        {
                            data: [
                                { id: 0, value: 26, label: "Text/Other" },
                                { id: 1, value: 50, label: "Images" },
                                { id: 2, value: 75, label: "Videos" },
                                { id: 3, value: 155, label: "Shared Libraries" },
                                { id: 4, value: 75, label: "Music" },
                                { id: 5, value: 155, label: "Other" }
                            ]
                        }
                    ]}
                    width={550}
                    height={200}
                    className="DisplayedPieChart"
                />
            </CardContent>
        </Card>
    )
}