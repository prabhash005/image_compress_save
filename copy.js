const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const sharp = require('sharp');

const s3 = new AWS.S3({
    accessKeyId: 'AKIAVSYBEZQGCM6UUNMM',
    secretAccessKey: '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',
    region: 'us-east-1',
});

const parentFolderPath = 'folder1'; // Path to the 'share' folder
const desiredFileName = '2416436.jpg'; // Replace with the desired image file name
const bucketName = 'meeting-bot-files-to-process';

function searchForFile(startPath, targetFileName) {
    const files = fs.readdirSync(startPath);

    for (const file of files) {
        const filePath = path.join(startPath, file);
        const stat = fs.statSync(filePath);



        if (stat.isDirectory()) {
            const foundPath = searchForFile(filePath, targetFileName);
            if (foundPath) {
                return path.join(file, foundPath);
            }
        } else if (file === targetFileName) {
            return file;
        }
    }

    return null;
}

const relativePathToImage = searchForFile(parentFolderPath, desiredFileName);

if (relativePathToImage) {
    const fullPathToImage = path.join(parentFolderPath, relativePathToImage);
    console.log('Full path to image:', fullPathToImage);
    const fileStream = fs.createReadStream(fullPathToImage);

    sharp(fullPathToImage)
        .resize({ width: 800 }) // Resize to a desired width
        .toBuffer((err, buffer) => {
            if (err) {
                console.error('Error resizing image:', err);
                return;
            }

            const objectKey = relativePathToImage.replace(/\\/g, '/');

            const uploadParams = {
                Bucket: bucketName,
                Key: objectKey,
                Body: buffer,
            };

            s3.upload(uploadParams, (err, data) => {
                if (err) {
                    console.error('Error uploading image to S3:', err);
                } else {
                    console.log('Image uploaded to S3 successfully:', data.Location);
                }
            });
        });
} else {
    console.log('Image not found.');
}
