const ElasticSearchClient = require('elasticsearchclient');

let elasticSearchClient = new ElasticSearchClient({
  'host' : 'localhost',
  'port' : 9200
});

module.exports = elasticSearchClient;
