const { DataSource } = require('typeorm');
const dbConfig = require('./ormconfig.js');

export default new DataSource(dbConfig);
