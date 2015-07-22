
var Set = require('./Set');
var Edge = require('./Edge');
_ = require('lodash');
var PrecursorTable = require('./PrecursorTable');
var PrecursorLine = require('./PrecursorLine');

module.exports = function(){

  Array.prototype.clone = function() {
	   return this.slice(0);
  };

  this.name = '';
  this.type = '';
  this.adjacency = [];

  this.vertices = new Set();
  this.edges = new Set();

  this.addVertex = function(vertex){
    this.vertices.add(vertex);
  };

  this.addEdges = function(edge){
    this.edges.add(edge);
  };

  this.getEdge = function(id){
    return this.edges.get(id);
  };

  this.getVertex = function(id){
    return this.vertices.get(id);
  };

  this.getVertexByName = function (name){
    return _.find(this.vertices.all(), 'name',name);
  };

  this.getVertices = function(){
    return this.vertices.all();
  };

  this.getVertexEdges = function(vertex){
    return _.filter(this.edges.all(), 'source', vertex);
  };

  this.buildEdges = function(){

    //Faz um loop nas adjacências criando as arestas
    for (var i = 0; i < this.adjacency.length; i++) {
      for (var j = 0; j < this.adjacency[i].length; j++) {
        if(this.adjacency[i][j]){
          var edge = new Edge(this.getVertex(i), this.getVertex(j), this.adjacency[i][j]);
          this.addEdges(edge);
        }
      }
    }
  };

  this.depthSearch = function (source, destination){

    var visited = [];
    var finished = [];
    var pt = new PrecursorTable();
    pt.init(_.clone(source), _.clone(this.vertices.all()));

    var find = function(self, src, dst, aCost){

      var edges = _.sortBy(self.getVertexEdges(src), 'cost');
      visited.push(src);

      console.log("Vertex:"+JSON.stringify(src));
      console.log("Edges:\n");
      console.log(edges);
      console.log('\n--- --- ---\n');

      for (var i = 0; i < edges.length; i++) {
        if(! _.some(visited, edges[i].destination))
          find(self, edges[i].destination, dst, aCost+edges[i].cost);
      }

      finished.push(src);
    };

    find(this, source, destination, 0);
  };

  this.bellmanFord = function (source, destination){

    var visited = [];
    var finished = [];
    var pt = new PrecursorTable();
    pt.init(_.clone(source), _.clone(this.vertices.all()));

    var find = function(self, src, dst, aCost){

      var edges = _.sortBy(self.getVertexEdges(src), 'cost');
      visited.push(src);

      for (var i = 0; i < edges.length; i++) {
        pt.relax(edges[i], aCost);
        if(! _.some(visited, edges[i].destination))
          find(self, edges[i].destination, dst, aCost+edges[i].cost);
      }

      finished.push(src);
    };

    find(this, source, destination, 0);

    return pt;
  };

  this.widthSearch = function (source, destination){
    var visited = [];
    var pt = new PrecursorTable();
    var rest = _.clone(this.vertices.all());

    pt.init(_.clone(source), _.clone(rest));

    while(!_.isEmpty(rest)){

        var node = rest.shift();
        var edges = _.sortBy(this.getVertexEdges(node), 'cost');

        console.log("Vertex: "+JSON.stringify(node));
        for (var i = 0; i < edges.length; i++) {
          console.log("Edge "+i+":");
          console.log(edges[i]);
        }
        console.log("\n--- --- --- ---\n");
        visited.push(node);
    }

    //return pt;
  };

};
