import Post from '../models/Post.js';
import User from '../models/User.js';
import uploadToFirebaseStorage from '../api/services/storage.js';

/* CREATE */
export const createPost = async (req, res) => {
    try {
        const { userId, desc } = req.body;
        
        // Ensure a file was uploaded
        if (!req.file) {
            return res.status(400).json({ message: "No image file uploaded." });
        }

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Upload image to Firebase Storage and get the public URL
        const picturePath = await uploadToFirebaseStorage(req.file.buffer, `posts/${userId}/${Date.now()}.jpg`, req.file.mimetype);

        // Create a new post
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            desc,
            location: user.location,
            userPicturePath: user.picturePath,
            picturePath, // Store the Firebase URI
            likes: {},
            comments: [],
        });

        // Save the post to the database
        await newPost.save();

        // Retrieve all posts (or you could just return the newly created post)
        const posts = await Post.find();

        // Return response
        res.status(201).json({ message: "Post created successfully.", posts });
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ message: "Failed to create post", error: error.message });
    }
};

export const getFeedPosts = async (req, res) => {
    try {
        const post = await Post.find();
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

export const getUserPost = async (req, res) => {
    try {
        const { userId } = req.params;
        const post = await Post.find({ userId });
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

/* UPDATE */
export const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId);
        if (isLiked) {
            post.likes.delete(userId);
        }
        else {
            post.likes.set(userId, true);
        }
        const updatedPost = await Post.findByIdAndUpdate(id, { likes: post.likes }, { new: true });
        res.status(200).json(updatedPost);
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
}