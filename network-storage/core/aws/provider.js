const awsSDk = require('aws-sdk');

const S3 = require('../../storage/S3Helper');

class AWS {
  /**
   * Expose AWS APIs
   * @constructor
   */
  constructor(configPath) {
    this._AWS = awsSDk;

    if (
      !this._AWS.config.credentials.accessKeyId ||
      !this._AWS.config.credentials.secretAccessKey ||
      !process.env.AWS_REGION
    ) {
        // this._AWS.config.loadFromPath(configPath);
    }
    return {
      getSDK: () => this._AWS,
      s3: this.S3,
    };
  }
 
  /**
   * S3 Wrapper
   * @S3
   * @param {object} options - { apiVersion }
   */
  S3(options) {
    if (options._apiVersion) {
      this._apiVersion = options.apiVersion;
      return new S3(this.getSDK(), this.apiVersion);
    }
    return new S3(this.getSDK());
  }
}

module.exports = AWS;
