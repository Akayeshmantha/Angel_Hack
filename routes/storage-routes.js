const express = require('express');
const router = express.Router();

// const S3_helper = require('../aws/storage/S3Helper');
const formidable = require('formidable');
const fs = require('fs');
const Helper = require("../aws");
const ncAWS = Helper.getProvider("AWS", process.env.ncconf);
const options = {
  apiVersion: "2016-11-15"
};
const S3_helper = ncAWS.s3(options);


router.post('/createBucket', function(req, res) {
    S3_helper.createBucket({ 'name': req.body.name, 'region': req.body.region }).then((data) => {
        res.json('Created the bucket ' + data);
    }).catch((err) => {
        res.json('Error in creating the bucket ' + err);
    });
});


router.post('/deletebucket', function(req, res) {
    S3_helper.deletebucket({ 'name': req.body.name, 'region': req.body.region }).then((data) => {
        res.json('Deleted bucket ' + data);
    }).catch((err) => {
        res.json('Error in deleting bucket ' + err);
    });
});

router.post('/upload', function(req, res) {
    S3_helper.upload({ 'name': req.body.name, 'region': req.body.region, 'fileName': req.body.fileName }).then((data) => {
        res.json('Successfully uploaded object ' + data);
    }).catch((err) => {
        res.json('Error in uploading object ' + err);
    });
});

router.post('/multipartUpload', function(req, res) {
    S3_helper.createMultipartUpload({ 'name': req.body.name, 'region': req.body.region, 'fileName': req.body.fileName }).then((data) => {
        res.json('Successfully uploaded object ' + data);
    }).catch((err) => {
        res.json('Error in uploading object ' + err);
    });
});

router.post('/listObjects', function(req, res) {
    S3_helper.listObjects({ 'name': req.body.name, 'region': req.body.region }).then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json(err);
    });
});

router.post('/listBucket', function(req, res) {
    S3_helper.listBuckets({ region: req.body.region }).then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json(err);
    });
});

router.post('/getObject', function(req, res) {
    S3_helper.getObject().then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json(err);
    });
});

router.post('/file-upload', function(req, res, next) {

    let options = {
        'name': 'ayeshpererk',
        'region': 'eu-west-1',
        'fileName': 'test.csv'
    };

    // if file is empty trigger a

    let form = new formidable.IncomingForm();
    form.maxFileSize = 5000000000;
    form.parse(req, function(err, fields, files) {
    });

    form.on('progress', function(bytesReceived, bytesExpected) {
        var percent_complete = (bytesReceived / bytesExpected) * 100;
        console.log(percent_complete.toFixed(2));
    });

    form.on('error', function(err) {
        console.error(err);
    });

    form.on('end', function(fields, files) {

        /* Temporary location of our uploaded file */
        let temp_path = this.openedFiles[0].path;
        /* The file name of the uploaded file */
        let file_name = this.openedFiles[0].name;
        /* Location where we want to copy the uploaded file */
        let new_location = '/tmp/';

        fs.copyFile(temp_path, new_location + file_name, function(err) {
            if (err) {
                res.json(err);                
            } else {
                S3_helper.createMultipartUpload({ 'name': 'walmart-data-store', 'region': 'eu-west-1', 'fileName': new_location + file_name }).then((data) => {
                    res.json(data)
                }).catch((err) => {
                    res.json(err);
                });
            }
        });
    });
});


module.exports = router;