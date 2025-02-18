import React from "react";

import { Modal, Box, CircularProgress, Typography } from "@mui/material";

/**
 * Loading device modal (before data is loaded)
 * @returns {React.JSX.Element} rendered web component
 */
export default function LoadingDeviceModal (): React.JSX.Element {
    return (
        <Modal
            open={true}>
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%"
            }}>
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#c2c2c2",
                    minWidth: "150px",
                    minHeight: "150px",
                    borderRadius: "22.5px",
                    padding: "16px",
                    alignItems: "center"
                }}>
                    <CircularProgress size={120} />
                    <Typography variant="h4"
                        sx={{
                            marginTop: "16px"
                        }}
                    >
                        Loading device
                    </Typography>
                </Box>
            </Box>
        </Modal>
    )
}
