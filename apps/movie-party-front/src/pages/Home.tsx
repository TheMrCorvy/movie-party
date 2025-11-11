import { lazy, Suspense, type FC } from "react";
import { Skeleton, Container, Box } from "@mui/material";

const CreateRoom = lazy(() => import("../components/CreateRoom"));

const CreateRoomSkeleton = () => (
    <Box
        sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            width: "100%",
        }}
    >
        <Container maxWidth="sm">
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Skeleton
                    variant="text"
                    width="60%"
                    height={40}
                    sx={{ mb: 2 }}
                />
                <Skeleton
                    variant="rounded"
                    width="100%"
                    height={56}
                    sx={{ mb: 2 }}
                />
                <Skeleton
                    variant="rounded"
                    width="100%"
                    height={56}
                    sx={{ mb: 2 }}
                />
                <Skeleton variant="rounded" width="100%" height={48} />
            </Box>
        </Container>
    </Box>
);

const Home: FC = () => {
    return (
        <Suspense fallback={<CreateRoomSkeleton />}>
            <CreateRoom />
        </Suspense>
    );
};

export default Home;
