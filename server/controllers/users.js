
import User from "../models/User.js";
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
    // try {
    const { id, friendId } = req.params;
    console.log(id);

    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    // console.log(user.friends);


    if (user.friends.includes(friendId)) {
        await User.findByIdAndUpdate(id, { $pull: { friends: friendId } });
        await User.findByIdAndUpdate(friendId, { $pull: { friends: id } });


    } else {
        await User.findByIdAndUpdate(id, { $push: { friends: friendId } });
        await User.findByIdAndUpdate(friendId, { $push: { friends: id } });
    }
    // await user.save();
    // await friend.save();

    const friendsDetails = await User.find(
        { _id: { $in: user.friends } },
        { firstName: 1, lastName: 1, picturePath: 1, location: 1, occupation: 1 }
    )

    res.status(200).json(friendsDetails);
    // const friends = await Promise.all(

    // );
    // const formattedFriends = friends.map(
    //     ({ _id, firstName, lastName, location, occupation, picturePath }) => {
    //         return { _id, firstName, lastName, location, occupation, picturePath };
    //     });

    // // console.log(formattedFriends);
    // res.status(200).json(formattedFriends);
    // // } catch (err) {
    //     res.status(404).json({ message: err.message });
    // }
}