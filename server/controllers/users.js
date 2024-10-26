
import User from "../models/User.js";
import mongoose from "mongoose";
/* READ */

export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);

    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}



export const getUserFriends = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        const friends = await User.find(
            { _id: { $in: user.friends } },
            { firstName: 1, lastName: 1, picturePath: 1, location: 1, occupation: 1 }
        );
        res.status(200).json(friends);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

/* UPDATE */


export const addRemoveFriend = async (req, res) => {
    try {
        const { id, friendId } = req.params;

        console.log('User ID:', id);
        console.log('Friend ID:', friendId);

        // Ensure both IDs are valid ObjectIds
        if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(friendId)) {
            return res.status(400).json({ message: "Invalid user ID or friend ID" });
        }

        // Fetch the user and the friend
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        // Check if user and friend exist
        if (!user || !friend) {
            return res.status(404).json({ message: "User or friend not found" });
        }

        // Check if friend is already in the user's friends list
        if (user.friends.includes(friendId)) {
            // Remove friend
            await User.findByIdAndUpdate(id, { $pull: { friends: friendId } });
            await User.findByIdAndUpdate(friendId, { $pull: { friends: id } });
        } else {
            // Add friend
            await User.findByIdAndUpdate(id, { $addToSet: { friends: friendId } });
            await User.findByIdAndUpdate(friendId, { $addToSet: { friends: id } });
        }

        // Retrieve updated friends details
        const updatedUser = await User.findById(id); // Fetch the user again to get updated friends list
        const friendsDetails = await User.find(
            { _id: { $in: updatedUser.friends } },
            { firstName: 1, lastName: 1, picturePath: 1, location: 1, occupation: 1 }
        );

        res.status(200).json(friendsDetails);
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ message: err.message });
    }
};

// export const addRemoveFriend = async (req, res) => {
//     // try {
//     const { id, friendId } = req.params;
//     console.log(id);

//     const user = await User.findById(id);
//     const friend = await User.findById(friendId);

//     // console.log(user.friends);


//     if (user.friends.includes(friendId)) {
//         await User.findByIdAndUpdate(id, { $pull: { friends: friendId } });
//         await User.findByIdAndUpdate(friendId, { $pull: { friends: id } });


//     } else {
//         await User.findByIdAndUpdate(id, { $push: { friends: friendId } });
//         await User.findByIdAndUpdate(friendId, { $push: { friends: id } });
//     }
//     // await user.save();
//     // await friend.save();

//     const friendsDetails = await User.find(
//         { _id: { $in: user.friends } },
//         { firstName: 1, lastName: 1, picturePath: 1, location: 1, occupation: 1 }
//     )

//     res.status(200).json(friendsDetails);
//     // const friends = await Promise.all(

//     // );
//     // const formattedFriends = friends.map(
//     //     ({ _id, firstName, lastName, location, occupation, picturePath }) => {
//     //         return { _id, firstName, lastName, location, occupation, picturePath };
//     //     });

//     // // console.log(formattedFriends);
//     // res.status(200).json(formattedFriends);
//     // // } catch (err) {
//     //     res.status(404).json({ message: err.message });
//     // }
// }
