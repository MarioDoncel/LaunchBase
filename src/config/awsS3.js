const AWS = require('aws-sdk')
const fs = require('fs')
const path = require('path')

AWS.config.update({})

const s3 = new AWS.S3({
  region: 'sa-east-1',
})

const saveS3 = async ({ filename }) => {

  const originalPath = path.join('./public/images', filename)
  const uploadParams = { Bucket: 'foodfy-doncel', Key: '', Body: '' };

  // Configure the file stream and obtain the upload parameters
  const fileStream = fs.createReadStream(originalPath);
  fileStream.on('error', function (err) {
    console.log('File Error', err);
  });
  uploadParams.Body = fileStream;
  uploadParams.Key = filename;

  // call S3 to retrieve upload file to specified bucket
  await s3.upload(uploadParams, function (err, data) {
    if (err) {
      console.log("Error", err);
    } if (data) {
      console.log("Upload Success", data.Location);
    }
  }).promise()
}

const deleteS3 = async ({ name }) => {
  const params = { Bucket: 'foodfy-doncel', Key: name };

  await s3.deleteObject(params, function (err, data) {
    if (err) console.log(err, err.stack);  // error
    else console.log();                 // deleted
  }).promise();
}




module.exports = { saveS3, deleteS3, s3 }