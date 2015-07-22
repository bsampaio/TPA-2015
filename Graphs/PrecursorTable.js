
_ = require('lodash');
var Set = require('./Set');
var PrecursorLine = require('./PrecursorLine');

var PrecursorTable = function(){

  this.lines = null;

  this.init = function(source, vertices){

    this.lines = new Set();
    _.remove(vertices, function(el){
      return _.isEqual(el,source);
    });

    addVertex(this, source, 0, null);
    for (var i = 0; i < vertices.length; i++) {
      addVertex(this, vertices[i], Infinity, null);
    }
  };

  var addVertex = function(self, vertex, cost, precursor){
    var l = new PrecursorLine(vertex, cost, precursor);

    if(! self.exists(vertex))
      self.lines.add(l);
  };

  this.exists = function(vertex){
    var lines = this.lines.all().clone();
    return _.some(lines,'vertex',vertex);
  };


  this.relax = function(edge, aCost){
    var allLines = this.lines.all();
    var lineId = null;
    var line = null;

    for (var i = 0; i < allLines.length; i++) {
      if(_.isEqual(allLines[i].vertex.id, edge.destination.id)){
        lineId = i;
        line = allLines[i];
        break;
      }
    }

    if(line.cost > edge.cost+aCost)
      this.lines.replace(lineId, new PrecursorLine(edge.destination, edge.cost, edge.source));
  };

  this.printTable = function(){
    var lines = this.lines.all();
    console.log('\t\t\t Tabela de Predecessores \t\t\t');
    console.log('|Vértice\t\t'+'|\tCusto\t\t'+'|\tPredecessor\t\t');
    for (var i = 0; i < lines.length; i++) {
      var msg = '|'+stf(lines[i].vertex)+'\t\t|\t'+lines[i].cost+'\t\t|\t'+stf(lines[i].precursor)+'\t';
      console.log(msg);
    }
  };

  var stf = function(obj){
    if(obj !== null)
      return JSON.stringify(obj.name);
  };
};

module.exports = PrecursorTable;
