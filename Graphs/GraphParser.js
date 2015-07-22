
fs = require('fs');
Graph = require('./Graph');
Vertex = require('./Vertex');

var GraphParser = function (){

  this.loadFile = function(filename){
    var file = fs.readFileSync('./resources/'+filename);
    return file.toString();
  };

  this.parse = function(filename){

    var graphFile = this.loadFile(filename);
    var lines = graphFile.split('\n').filter(function(element){
      return element !== '';
    });
    var graph = new Graph();
    graph.name = lines[0];
    graph.type = lines[1];
    var nmbVertices = lines[2];
    var vIndex = 3;

    //Construindo os vértices
    for (var i = 0; i < nmbVertices; i++) {
      graph.addVertex(new Vertex(i, lines[vIndex]));
      vIndex++;
    }

    for (var j = 0; j < nmbVertices; j++){
      var line = lines[vIndex];
      var costs = line.split(' ');
      //Remove o \n
      //costs.pop();

      for (var k = 0; k < costs.length; k++) {
        costs[k] = parseFloat(costs[k]);
      }

      graph.adjacency[j] = costs;
      vIndex++;
    }

    graph.buildEdges();

    return graph;
  };
};

module.exports = GraphParser;
