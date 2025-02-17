import { Grid2 } from "@mui/material";
import DeviceStatSkeleton from "./DeviceStat";

export default function DeviceSpecsMainInfosSkeleton(){
    const deviceStats = []
    for(let i = 0;i<5;i++){
        deviceStats.push(<DeviceStatSkeleton/>)
    }
    return(
        <Grid2 container spacing={2} id="deviceMainInfosSpecs">
            {deviceStats}
        </Grid2>
    )
}