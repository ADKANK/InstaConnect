import mongoose from "mongoose";
import User from "../../models/User.js"; // Adjust the import path as necessary
import Post from "../../models/Post.js"; // Adjust the import path as necessary
import { users, posts } from "../../data/index.js"; // Adjust the import path to your mock data
import uploadToFirebaseStorage from "./storage.js"; // Adjust the import path as necessary
import fs from 'fs'; // File system module to read images

// Function to seed the database
const getRandomImage = (images) => {
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
};

// Function to generate random likes
const generateRandomLikes = (userIds) => {
    const likes = new Map();
    const numberOfLikes = Math.floor(Math.random() * userIds.length); // Random number of likes (0 to total users)
    
    // Randomly select users to like the post
    for (let i = 0; i < numberOfLikes; i++) {
        const randomUserId = userIds[Math.floor(Math.random() * userIds.length)];
        likes.set(randomUserId, true);
    }

    return likes;
};

// Function to seed the database
export const seedDatabase = async () => {
    try {
        await User.deleteMany({});
        await Post.deleteMany({});

        const userImagesDir = '../../../../InstaConnect/server/public/assets';
        const userImages = fs.readdirSync(userImagesDir).filter(file => /\.(jpg|jpeg|png|gif)$/.test(file));

        // Read and upload user images
        const usersWithSignedURLs = await Promise.all(
            users.map(async (user) => {
                const userImageFileName = getRandomImage(userImages); // Get a random image
                const userImageBuffer = fs.readFileSync(`${userImagesDir}/${userImageFileName}`);
                const mimeType = "image/jpeg"; // Adjust as necessary

                // Upload and get signed URL
                const userSignedUrl = await uploadToFirebaseStorage(userImageBuffer, userImageFileName, mimeType);
                user.picturePath = userSignedUrl; // Update picturePath with signed URL

                return { ...user, _id: new mongoose.Types.ObjectId() }; // Ensure unique ID
            })
        );

        await User.insertMany(usersWithSignedURLs);


        const postImagesDir = '../../../../InstaConnect/server/public/assets';
        const postImages = fs.readdirSync(postImagesDir).filter(file => /\.(jpg|jpeg|png|gif)$/.test(file));

        // Generate posts with signed URLs
        const postsWithSignedURLs = await Promise.all(
            posts.map(async (post) => {
                const postImageFileName = getRandomImage(postImages); // Get a random image
                const postImageBuffer = fs.readFileSync(`${postImagesDir}/${postImageFileName}`);
                const mimeType = "image/jpeg"; // Adjust as necessary

                // Upload and get signed URL for post picture
                const postSignedUrl = await uploadToFirebaseStorage(postImageBuffer, postImageFileName, mimeType);
                post.picturePath = postSignedUrl; 
                
                
                const user = usersWithSignedURLs[Math.floor(Math.random() * usersWithSignedURLs.length)];

                const likes = generateRandomLikes(usersWithSignedURLs.map(user => user._id));

                return {
                    _id: new mongoose.Types.ObjectId(),
                    userId: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    location: user.location,
                    description: post.description,
                    picturePath: post.picturePath, 
                    userPicturePath: user.picturePath, 
                    likes: likes, 
                };
            })
        );

        await Post.insertMany(postsWithSignedURLs);
        console.log("Database seeded successfully!");

    } catch (error) {
        console.error("Error seeding database:", error);
    }
};
