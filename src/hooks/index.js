const { useTableSync } = require('./useTableSync');
const { useTableAsync } = require('./useTableAsync');
const {Table} = require('../table');

module.exports = {
   Table,
   useTableAsync,
   useTableSync
}