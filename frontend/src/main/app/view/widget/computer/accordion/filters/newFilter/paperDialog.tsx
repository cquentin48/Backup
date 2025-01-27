import { Paper } from "@mui/material";
import NewFilterForm from "./form";

export default function NewFilterPaperDialog(){
    return <Paper sx={{
        position: "absolute",
        top: "97px",
        zIndex: "1",
        left: "0px"
    }}>
        <NewFilterForm/>
    </Paper>
}