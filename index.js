
var GraphParser = require('./GraphParser');
var gp = new GraphParser();
var graph = gp.parse('graph1');

graph.depthSearch();
