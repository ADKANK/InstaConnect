import { Box, Typography, useTheme } from "@mui/material";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "state";

const FriendListWidget = ({ userId }) => {
    const dispatch = useDispatch();
    const { palette } = useTheme();
    const token = useSelector((state) => state.token);
    const friends = useSelector((state) => state.user.friends) || []; // Initialize as empty array

    const getFriends = async () => {
        try {
            const response = await fetch(`https://server-chi-bay.vercel.app/users/${userId}/friends`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch friends');
            }
            const data = await response.json();
            console.log('Friends data:', data); // Log the fetched data
            dispatch(setFriends({ friends: data }));
        } catch (error) {
            console.error('Error fetching friends:', error);
        }
    };

    useEffect(() => {
        getFriends();
    }, [userId, token]); // Include userId and token in dependencies

    console.log('Current friends state:', friends); // Log the current friends state

    return (
        <WidgetWrapper>
            <Typography
                color={palette.neutral.dark}
                variant="h5"
                fontWeight="500"
                sx={{ mb: "1.5rem" }}
            >
                Friend List
            </Typography>
            <Box display="flex" flexDirection="column" gap="1.5rem">
                {friends.length > 0 ? (
                    friends.map((friend) => (
                        <Friend
                            key={friend._id}
                            friendId={friend._id}
                            name={`${friend.firstName} ${friend.lastName}`}
                            subtitle={friend.occupation}
                            userPicturePath={friend.picturePath}
                        />
                    ))
                ) : (
                    <Typography>No friends found.</Typography>
                )}
            </Box>
        </WidgetWrapper>
    );
};

export default FriendListWidget;
