const { MongoMemoryServer } = require('mongodb-memory-server');

module.exports = async function () {
  const mongod = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongod.getUri();
  global.__MONGOD__ = mongod;
};
