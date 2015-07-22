
var _ = require('lodash');
var GraphParser = require('./GraphParser');
var gp = new GraphParser();
var graph = gp.parse('graph2');

var table = graph.depthSearch(graph.getVertexByName('Vitória'), graph.getVertexByName('Cariacica'));
table.printTable();
//console.log(graph.getVertexEdges(graph.getVertexByName('Vitória')));
