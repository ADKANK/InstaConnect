import { Box, Typography, useTheme, useMediaQuery, Container } from "@mui/material";
import Form from "./Form";

const LoginPage = () => {
    const theme = useTheme();
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    return (
        <Box >
            <Box width="100%" backgroundColor={theme.palette.background.alt} padding="1rem 6%" textAlign="center">
                <Typography fontWeight="bold" fontSize="32px" color="primary">
                    InstaConnect
                </Typography>
            </Box>

            <Box width={isNonMobileScreens ? "50%" : "100%"} textAlign="center" p="2rem" m="2rem auto" borderRadius="1.5rem" backgroundColor={theme.palette.background.alt}>
                <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
                    Connect to People around the world
                </Typography>
            </Box>
            <Form />
        </Box>
    );
};

export default LoginPage;