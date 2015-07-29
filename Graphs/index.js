
var _ = require('lodash');
var GraphParser = require('./GraphParser');
var gp = new GraphParser();
var graph = gp.parse('gt3');

// console.log("Busca em profundidade: \n");
// graph.depthSearch(graph.getVertexByName('A'), graph.getVertexByName('E'), true);
// console.log("\n------\n");
//
// console.log("Busca em Largura: \n");
// graph.widthSearch(graph.getVertexByName('A'));
// console.log("\n------\n");
//
// console.log("GAO: \n");
// graph.GAO(graph.getVertexByName('A'));
// console.log("\n------\n");
//
// console.log("Bellman-Ford: \n");
// graph.BellmanFord(graph.getVertexByName('A'));
// console.log("\n------\n");

console.log("PRIM:\n");
graph.Prim(graph.getVertexByName('A'), true);
console.log("\n------\n");
