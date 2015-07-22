
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
      for (var k = 0; k < lines[vIndex].length; k++) {

        var adjLine = [];

        for (var l = 0; l < lines[vIndex].length; l++) {

          if(lines[vIndex][l] !== ' ' && lines[vIndex][l] !== '\n')
            adjLine.push(parseFloat(lines[vIndex][l]));
        }

        graph.adjacency[j] = adjLine;
      }
      vIndex++;
    }

    graph.buildEdges();

    return graph;
  };
};

module.exports = GraphParser;
