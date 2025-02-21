import { Box, Typography } from "@mui/material";

export default function DeviceNotFound (): React.JSX.Element {
    return (
        <div id="DeviceMainInfosPage">
            <Box sx={{
                bgcolor: "#ff7c60",
                width: "fit-content",
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                position: "absolute",
                top: "25%",
                left: "50%",
                transform: "translate(-50%, -25%)",
                padding: "12px",
                borderRadius: "16px"
            }}>
                <Typography variant='h4'>
                    The device you are looking for is unavailable right now.
                    Please check if the device ID you passed is correct.
                    <br />
                    If you think the device ID you entered is correct, please contact your
                    administrator quickly.
                </Typography>
            </Box>
        </div>
    )
}