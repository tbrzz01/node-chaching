const assert = require('assert');
const Cache = require('../index.js');

describe('nodeChaching', () => {
  it('"get" returns key from function', async () => {
    const getFunction = () => Promise.resolve({id: 1, value: 'value'});
    const cache = new Cache(10, getFunction);
    const value = await cache.get({key: 'my-key'});
    assert.equal(value.id, 1);
    assert.equal(value.value, 'value');
  });

  it('"get" returns key from cache', async () => {
    let called = 0;
    const getFunction = () => {
      called++;
      return Promise.resolve({id: 1, value: 'value'});
    };

    const cache = new Cache(100, getFunction);
    const valueOne = await cache.get({key: 'my-key'});
    const valueTwo = await cache.get({key: 'my-key'});
    assert.equal(valueOne.id, 1);
    assert.equal(valueOne.value, 'value');
    assert.equal(valueTwo.id, valueOne.id);
    assert.equal(valueTwo.value, valueOne.value);
    assert.equal(called, 1);
  });

  it('"countKeys" returns right count of keys', async () => {
    const getFunction = () => Promise.resolve({id: 1, value: 'value'});
    const cache = new Cache(100, getFunction);

    await cache.get({key: 'my-key-1'});
    assert.equal(cache.countKeys(), 1);
    await cache.get({key: 'my-key-2'});
    assert.equal(cache.countKeys(), 2);
  });

  it('"del" removes key and value from cache', async () => {
    const getFunction = () => Promise.resolve({id: 1, value: 'value'});
    const cache = new Cache(100, getFunction);

    await cache.get({key: 'my-key-1'});
    await cache.get({key: 'my-key-2'});
    assert.equal(cache.countKeys(), 2);
    cache.del('my-key-1');
    assert.equal(cache.countKeys(), 1);
  });

  it('"del" removes all given keys and values from cache', async () => {
    const getFunction = () => Promise.resolve({id: 1, value: 'value'});
    const cache = new Cache(100, getFunction);

    await cache.get({key: 'my-key-1'});
    await cache.get({key: 'my-key-2'});
    assert.equal(cache.countKeys(), 2);
    cache.del(['my-key-1', 'my-key-2']);
    assert.equal(cache.countKeys(), 0);
  });

  it('"flush" removes all keys and values from cache', async () => {
    const getFunction = () => Promise.resolve({id: 1, value: 'value'});
    const cache = new Cache(100, getFunction);

    await cache.get({key: 'my-key-1'});
    await cache.get({key: 'my-key-2'});
    assert.equal(cache.countKeys(), 2);
    cache.flush();
    assert.equal(cache.countKeys(), 0);
  });

  it('"get" throws when getFunction throws', async () => {
    const getFunction = () => {
      throw new Error('error');
    };

    const cache = new Cache(100, getFunction);

    assert.throws(() => cache.get('my-key-1'));
  });
});
