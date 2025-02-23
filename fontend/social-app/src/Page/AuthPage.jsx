import { Container, Box, Grid2, Stack, Typography } from "@mui/material";
import AuthForm from "../Component/AuthForm/AuthForm";

const AuthPage = () => {
    return (
        <Box minHeight="100vh" display="flex" justifyContent="center" alignItems="center" px={2}>
            <Container maxWidth="md">
                <Grid2 container justifyContent="center" alignItems="center" spacing={5}>
                    {/* Left-hand side (Hidden on small screens) */}
                    <Grid2 md={6} display={{ xs: "none", md: "block" }}>
                        <Box component="img" src="/auth.png" alt="Phone img" sx={{ maxWidth: 650, height: "auto" }} />
                    </Grid2>

                    {/* Right-hand side */}
                    <Grid2
                        xs={12} md={8} lg={6} sx={{ width: "45%" }}
                    >
                        <Stack spacing={3}>
                            <AuthForm />

                            {/* Get the App Section */}
                            <Typography variant="body2" textAlign="center">
                                Get the app.
                            </Typography>
                            <Box display="flex" justifyContent="center" gap={2}>
                                <Box component="img" src="/playstore.png" alt="Playstore logo" sx={{ height: 40 }} />
                                <Box component="img" src="/microsoft.png" alt="Microsoft logo" sx={{ height: 40 }} />
                            </Box>
                        </Stack>
                    </Grid2>
                </Grid2>
            </Container>
        </Box>
    );
};

export default AuthPage;
