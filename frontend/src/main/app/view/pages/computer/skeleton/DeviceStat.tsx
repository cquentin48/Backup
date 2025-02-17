import { Grid2, Card, CardHeader, Avatar, CardContent, Skeleton } from "@mui/material";

export default function DeviceStatSkeleton () {
    return (
        <Grid2 size={{ md: 2 }}>
            <Card className="DeviceSpecsCard">
                <CardHeader avatar={
                    <Avatar>
                        <Skeleton variant="circular" width={40} height={40} />
                    </Avatar>
                }
                    title={
                        <Skeleton variant="rounded" width="100%" height={40} />
                    }
                />
                <CardContent>
                    <Skeleton variant="rounded" width="100%" height={60} />
                </CardContent>
            </Card>
        </Grid2>
    )
}