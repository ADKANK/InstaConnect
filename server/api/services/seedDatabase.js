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

// Function to seed the database
export const seedDatabase = async () => {
    try {
        await User.deleteMany({});
        await Post.deleteMany({});

        // User images
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

        // Post images
        const postImagesDir = '../../../../InstaConnect/server/public/assets';
        const postImages = fs.readdirSync(postImagesDir).filter(file => /\.(jpg|jpeg|png|gif)$/.test(file));

        // Read and upload post images
        const postsWithSignedURLs = await Promise.all(
            posts.map(async (post) => {
                const postImageFileName = getRandomImage(postImages); // Get a random image
                const postImageBuffer = fs.readFileSync(`${postImagesDir}/${postImageFileName}`);
                const mimeType = "image/jpeg"; // Adjust as necessary

                // Upload and get signed URL
                const postSignedUrl = await uploadToFirebaseStorage(postImageBuffer, postImageFileName, mimeType);
                post.picturePath = postSignedUrl; // Update picturePath with signed URL

                return { ...post, _id: new mongoose.Types.ObjectId() }; // Ensure unique ID
            })
        );

        await Post.insertMany(postsWithSignedURLs);
        console.log("Database seeded successfully!");

    } catch (error) {
        console.error("Error seeding database:", error);
    }
};