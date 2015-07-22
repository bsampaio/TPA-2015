
var _ = require('lodash');
var GraphParser = require('./GraphParser');
var gp = new GraphParser();
var graph = gp.parse('gt2');

//graph.depthSearch(graph.getVertexByName('Serra'), graph.getVertexByName('Vila-Velha'));
//graph.widthSearch(graph.getVertexByName('Serra'), graph.getVertexByName('Vila-Velha'));
var table = graph.bellmanFord(graph.getVertexByName('A'), graph.getVertexByName('E'));
table.printTable();
//console.log(graph.getVertexEdges(graph.getVertexByName('Vitória')));
