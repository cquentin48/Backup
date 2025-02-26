import React from "react";

import { Modal, Box, CircularProgress, Typography } from "@mui/material";
import { useSelector } from "react-redux";

import { deviceState } from "../../controller/deviceMainInfos/loadDeviceSlice";
import { snapshotState } from "../../controller/deviceMainInfos/loadSnapshotSlice";

/**
 * Loading device modal (before data is loaded)
 * @returns {React.JSX.Element} rendered web component
 */
export default function LoadingDeviceModal (): React.JSX.Element {
    const { deviceLoading } = useSelector(deviceState)
    const { operationStatus } = useSelector(snapshotState)

    /**
     * Set the text for the modal loading
     * @returns {string} Modal text
     */
    const setModalText = (): string => {
        let modalText;
        if (deviceLoading) {
            modalText = "Loading device informations"
        } else if (operationStatus === "loading" || operationStatus === "initial") {
            modalText = "Loading snapshot informations"
        } else {
            modalText = ""
        }
        return modalText
    }

    return (
        <Modal
            open={deviceLoading || (operationStatus === "loading" || operationStatus === "initial")}>
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
                        {setModalText()}
                    </Typography>
                </Box>
            </Box>
        </Modal>
    )
}
