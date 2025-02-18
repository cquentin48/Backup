import React from "react";

import { Skeleton, Paper } from "@mui/material";
import FormatsSkeleton from "./Formats";

/**
 * Main information frame skeleton component. Rendered before device data is loaded
 * @returns {React.JSX.Element} rendered web component
 */
export default function MainInfosFrameSkeleton (): React.JSX.Element {
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
