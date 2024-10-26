import { Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";

const AdvertWidget = () => {
    const { palette } = useTheme();
    const dark = palette.neutral.dark;
    const main = palette.neutral.main;
    const medium = palette.neutral.medium;

    return (
        <WidgetWrapper>
            <FlexBetween>
                <Typography color={dark} variant="h4" fontWeight="500">
                    Sponsored
                </Typography>
                <Typography color={medium}>
                    Create Ad
                </Typography>
            </FlexBetween>
            <img
                width="100%"
                height="auto"
                alt="advert"
                src="https://firebasestorage.googleapis.com/v0/b/instaconnect-3b72c.appspot.com/o/info4.jpeg?alt=media&token=b0db026a-fcb8-4af9-93cf-1f9ec7d9d9b6"
                style={{ borderRadius: "0.75rem", margin: "0.75rem 0" }}
            />
            <FlexBetween>
                <Typography color={main}>
                    Mika Cosmetics
                </Typography>
                <Typography color={medium}>
                    mikacosmetics.com
                </Typography>
                <Typography color={medium} m="0.5rem 0">
                    Your pathway to stunning beauty
                </Typography>
            </FlexBetween>

        </WidgetWrapper>
    )
}


export default AdvertWidget;