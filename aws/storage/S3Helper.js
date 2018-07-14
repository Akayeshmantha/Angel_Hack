const fs = require('fs');
const path = require('path');
const multipartMap = {
    Parts: []
};

class S3Helper{

   /**
   * S3 constructor
   * @constructor
   * @param {object} aws - AWS SDK
   * @param {object} options - { apiVersion }
   */
    constructor(aws,s3, options) {
        if(aws !== undefined){
            this._AWS = aws;
            this._s3 = new this._AWS.S3();
        }else if(s3 !== undefined){
            this._s3 = s3
        }
    }

    /**
     * Create new bucket
     * @param {object} options 
     */
    createBucket(options){
        const myBucket = options.name;
        return new Promise((resolve, reject) => {
            this._s3.createBucket({ Bucket: myBucket }, function(err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data.Location);
                }
            });
        });
    }

    /**
     * Delete bucket
     * @param {object} options 
     */
    deletebucket(options){
        const myBucket = options.name;
        return new Promise((resolve, reject) => {
            this._s3.deleteBucket({ Bucket: myBucket }, function(err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    /**
     * Create multipart upload
     * @param {object} options 
     */
    createMultipartUpload(options){
        const myBucket = options.name;
        const filepath = options.fileName;
        const fileName = path.basename(options.fileName);
        let multipartParams = {
            Bucket: myBucket,
            Key: fileName
        };
        let buffer = fs.readFileSync(filepath);

        let partNum = 0;
        let partSize = 1024 * 1024 * 5; // 5mb chunks except last part
        let numPartsLeft = Math.ceil(buffer.length / partSize);
        let maxUploadTries = 3;
        return new Promise((resolve, reject) => {
            var s3 = this._s3;
            this._s3.createMultipartUpload(multipartParams, function(mpErr, multipart) {
                if (mpErr) { reject(mpErr) }
                console.log("Got upload ID", multipart.UploadId);
                // Grab each partSize chunk and upload it as a part
                for (var rangeStart = 0; rangeStart < buffer.length; rangeStart += partSize) {
                    partNum++;
                    var end = Math.min(rangeStart + partSize, buffer.length),
                        partParams = {
                            Body: buffer.slice(rangeStart, end),
                            Bucket: myBucket,
                            Key: fileName,
                            PartNumber: String(partNum),
                            UploadId: multipart.UploadId
                        };
                    // Send a single part
                    console.log('Uploading part: #', partParams.PartNumber, ', Range start:', rangeStart);
                    S3Helper.uploadPart(s3, multipart, partParams, numPartsLeft, multipartParams).then((res) => {
                        resolve(res);
                    }).catch((err) => {
                        reject("Error in uploading all parts" + err);
                    });
                    --numPartsLeft;
                }

            });
        });
    }

    /**
     * Upload one part of the multipart upload 
     * @param {object} s3 
     * @param {object} multipart 
     * @param {object} partParams 
     * @param {number} numPartsLeft 
     * @param {object} multipartParams 
     * @param {number} tryNum 
     */
   static uploadPart(s3, multipart, partParams, numPartsLeft, multipartParams, tryNum){
        var tryNum = tryNum || 1;
        return new Promise((resolve, reject) => {
            s3.uploadPart(partParams, function(multiErr, mData) {
                console.log('started');
                if (multiErr) {
                    console.log('Upload part error:', multiErr);

                    if (tryNum < maxUploadTries) {
                        console.log('Retrying upload of part: #', partParams.PartNumber);
                        S3Helper.uploadPart(s3, multipart, partParams, numPartsLeft, multipartParams, tryNum + 1);
                    } else {
                        console.log('Failed uploading part: #', partParams.PartNumber);
                        reject('error uploading ' + partParams.PartNumber);
                    }
                    // return;
                }

                multipartMap.Parts[this.request.params.PartNumber - 1] = {
                    ETag: mData.ETag,
                    PartNumber: Number(this.request.params.PartNumber)
                };
                console.log('Completed part', this.request.params.PartNumber);
                console.log('mData', mData);
                console.log('num of partrs left', numPartsLeft);
                if (--numPartsLeft == 0) { // complete only when all parts uploaded

                    var doneParams = {
                        Bucket: multipartParams.Bucket,
                        Key: multipartParams.Key,
                        MultipartUpload: multipartMap,
                        UploadId: multipart.UploadId
                    };

                    console.log('Completing upload...');
                    S3Helper.completeMultipartUpload(s3, doneParams).then((res) => {
                        resolve(res);
                    }).catch((err) => {
                        reject(err);
                    });
                }
            }).on('httpUploadProgress', function(progress) { console.log(Math.round(progress.loaded / progress.total * 100) + '% done') });

        });
    }

    /**
     * Complete multipart upload
     * @param {object} s3 
     * @param {object} doneParams 
     */
    static completeMultipartUpload(s3, doneParams){
        return new Promise((resolve, reject) => {
            s3.completeMultipartUpload(doneParams, function(err, data) {
                if (err) {
                    reject(err);
                }

                console.log('Final upload data:', data.Location);
                resolve(data.Location);
            });
        });
    }

    /**
     * List all buckets
     * @param {Object} options 
     */
    listBuckets(options){
        return new Promise((resolve, reject) => {
            this._s3.listBuckets({}, function(err, data) {
                if (err) {
                    reject(err);
                } else {
                    let i = 0;
                    let bucketName = [];
                    for (i in data.Buckets) {
                        bucketName.push(data.Buckets[i].Name);
                    }
                    resolve(bucketName);
                }
            });
        });
    }
    
    /**
     * List all objects inside 
     * a bucket
     * @param {Object} options 
     */
    listObjects(options){
        const myBucket = options.name;
        return new Promise((resolve, reject) => {
            this._s3.listObjects({ Bucket: myBucket }, function(err, data) {
                if (err) {
                    reject(err);
                } else {
                    var i = 0;
                    var fileNames = [];
                    for (i in data.Contents) {
                        fileNames.push(data.Contents[i].Key);
                    }
                    resolve(fileNames);
                }
            });
        });
    }

    /**
     * list meta data of a an object 
     * @param {object} options 
     */
    listObjectsMetadata(options){
        const myBucket = options.name;
        return new Promise((resolve, reject) => {
            this._s3.listObjects({ Bucket: myBucket }, function(err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    /**
     * upload object
     * @param {object} options 
     */
    upload(options){
        let uploadParams = { Bucket: options.name, Key: '', Body: '' };
        let file = options.fileName;
        let fileStream = fs.createReadStream(file);
        fileStream.on('error', function(err) {
            console.log('File Error', err);
        });
        uploadParams.Body = fileStream;
        uploadParams.Key = path.basename(file);
        return new Promise((resolve, reject) => {
            this._s3.upload(uploadParams, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data.Location);
                }
            });
        });
    }


    /**
     * get object
     * @param {object} options 
     */
    getObject(options){
        let params = {
            Bucket: "ayeshpererk",
            Key: 'aka.csv'
        };

        return new Promise((resolve, reject) => {
            this._s3.getObject(params, function(err, data) {
                if (err) {
                    reject(err);
                    console.log(err);
                } // an error occurred
                else {
                    resolve(data.ContentLength);
                } // successful respond

            });
        });
    }
};

module.exports = S3Helper;