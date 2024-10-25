
import admin from '../../firebase.js'

const bucket = admin.storage().bucket();

const uploadToFirebaseStorage = async (fileBuffer, fileName, mimeType) => {
    const file = bucket.file(fileName);
    await file.save(fileBuffer, {
        metadata: { contentType: mimeType },
        public: true, 
    });
    return `https://storage.googleapis.com/${process.env.FIREBASE_STORAGE_BUCKET}/${fileName}`;
};

export default uploadToFirebaseStorage;
