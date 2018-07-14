const awsProvider = require('./aws/provider');

class Provider {
  /**
   * Provider constructor
   * @constructor
   * @param {string} provider - Type of provider - can be found here '/aws/provider'
   */
  constructor(provider, configPath) {
    this._provider = this.getProvider(provider, configPath);
    return this._provider;
  }
  /**
   * Returns requested provider type
   * @param {string} provider - Type of provider - can be found here '/aws/provider'
   */
  getProvider(provider, configPath) {
      return new awsProvider(configPath);
  }
}

module.exports = Provider;
