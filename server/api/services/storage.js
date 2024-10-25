
import admin from '../../firebase.js'

const storage = admin.storage(); 
const bucket = storage.bucket();


const options = {
    version: 'v4',
    action: 'read',
    expires: Date.now() + 604800 * 1000, // 2 years
};

const uploadToFirebaseStorage = async (fileBuffer, fileName, mimeType) => {
    const file = bucket.file(fileName);
    await file.save(fileBuffer, {
        metadata: { contentType: mimeType },
        public: true, 
    });
    const [url] = await file.getSignedUrl(options);
    // return `https://storage.googleapis.com/${process.env.FIREBASE_STORAGE_BUCKET}/${fileName}`;
    return url; 
};

export default uploadToFirebaseStorage;
