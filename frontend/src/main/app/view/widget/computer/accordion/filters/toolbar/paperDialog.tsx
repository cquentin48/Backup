import { Paper } from "@mui/material";
import NewFilterForm from "./form";

import "../../../../../../../res/css/ComputerMainInfos.css";
import { useGridApiContext } from "@mui/x-data-grid";

export default function NewFilterPaperDialog(){
    return <Paper id="NewFilterPaperDialog">
        <NewFilterForm/>
    </Paper>
}