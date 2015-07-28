
var _ = require('lodash');
var GraphParser = require('./GraphParser');
var gp = new GraphParser();
var graph = gp.parse('gt3');

//graph.depthSearch(graph.getVertexByName('A'), graph.getVertexByName('E'));
//graph.widthSearch(graph.getVertexByName('A'));
var table = graph.bellmanFord(graph.getVertexByName('A'), graph.getVertexByName('E'));
table.printTable();
//console.log(graph.getVertexEdges(graph.getVertexByName('Vitória')));
