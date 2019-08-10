'use strict';

const NodeCache = require('node-cache');

/**
 * Reusable single-purpose cache.
 */
class Cache {
  /**
   * Creates new Cache.
   * @param {number} ttlSeconds Cache time to live by seconds
   * @param {function} getFunction Function to retrieve value
   */
  constructor(ttlSeconds, getFunction) {
    this.cache = new NodeCache({stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2, useClones: true});
    this.getFunction = getFunction;
  }

  /**
   * Retrieves cache entry for key. Will retrieve value if cache misses.
   * @param {object} args key and options for cache retrieve
   * @returns {any} Value for given key
   */
  get(args) {
    const value = this.cache.get(args.key);
    if (value) {
      return Promise.resolve(value);
    }

    return this.getFunction(args).then((result) => {
      this.cache.set(args.key, result);
      return result;
    });
  }

  /**
   * Delete one or more keys and their values from the cache
   * @param {[string]} keys Keys to delete from the cache.
   */
  del(keys) {
    this.cache.del(keys);
  }

  /**
   * Flush all keys and values from the cache.
   */
  flush() {
    this.cache.flushAll();
  }

  countKeys() {
    return this.cache.getStats().keys;
  }
}

module.exports = Cache;
