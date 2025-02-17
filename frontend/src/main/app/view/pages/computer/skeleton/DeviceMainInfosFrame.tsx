import { Skeleton, Paper } from "@mui/material";
import FormatsSkeleton from "./Formats";

export default function MainInfosFrameSkeleton () {
    return (
        <div id="mainInfosTable">
            <div id="mainInfosTableSelectHeader">
                <Skeleton
                    variant="circular"
                    width={40}
                    height={40}
                    className="avatarIcon"
                />
                <Skeleton variant="rounded" width={256} height={56} />
            </div>
            <Paper elevation={2} id="detailsContainer">
                <FormatsSkeleton/>
            </Paper>
        </div>
    );
}