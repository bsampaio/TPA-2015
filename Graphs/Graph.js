
/**
 * Definindo constantes de configuração
 */
var CONSTANTS = (function() {
     var private = {
         'STATES': {
           "visited":"VISITED",
           "finished":"FINISHED",
           "pristine":"PRISTINE"
         },
     };

     return {
        /**
         * Retorna o valor correspondente à constante
         */
        get: function(name) { return private[name]; }
    };
})();

var Set = require('./Set');
var Edge = require('./Edge');
_ = require('lodash');
var PrecursorTable = require('./PrecursorTable');
var PrecursorLine = require('./PrecursorLine');
var DFSReport = require('./DFSReport');

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
    var p = [];
    var pt = new PrecursorTable();
    pt.init(_.clone(source), _.clone(this.vertices.all()));
    this.vertices.all().forEach(function(element, index, all){
      p[element.id] = [];
    });

    var find = function(self, src, dst, aCost){

      var edges = _.sortBy(self.getVertexEdges(src), 'cost');
      visited.push(src);

      for (var i = 0; i < edges.length; i++) {
        if(! _.some(visited, edges[i].destination)){
          p[edges[i].destination.id].push(src);
          find(self, edges[i].destination, dst, aCost+edges[i].cost);
        }
      }

      finished.push(src);
    };

    find(this, source, destination, 0);

    var v = this.vertices.all();
    for (var i = 0; i < v.length; i++) {
      var vid = v[i].id;
      console.log("Vertice |   Pred. ");
      console.log(JSON.stringify(v[i].name)+" \t| \t"+JSON.stringify(_.uniq(_.pluck(p[vid],'name'))));
    }
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

    for (var i = 0; i < this.vertices.length; i++) {
      find(this, source, destination, 0);
    }

    return pt;
  };

  this.widthSearch = function (source){
    var visited = [];
    var next = [];
    next.push(source);
    var p = [];
    var vertices = _.clone(this.vertices.all());
    vertices.forEach(function(el, i, all){
      p[el.id] = [];
    });

    while(!_.isEmpty(next)){

        var node = next.shift();
        visited.push(node);
        var edges = _.sortBy(this.getVertexEdges(node), 'cost');

        for (var i = 0; i < edges.length; i++) {
          if(! _.some(visited, edges[i].destination)){
            next.push(edges[i].destination);
            p[edges[i].destination.id] = edges[i].source;
            visited.push(edges[i].destination);
          }
        }
    }

    for (var j = 0; j < vertices.length; j++) {
      var vid = vertices[j].id;
      console.log("Vertice |   Pred. ");
      console.log(JSON.stringify(vertices[j].name)+" \t| \t"+JSON.stringify(p[vid].name));
    }
  };

  this.dfs = function(){
    var status = [];
    var timer = {time: 0};
    var discoveryTime = [];
    var pred = [];
    var finishTime = [];
    var vertices = _.clone(this.vertices.all());
    vertices.forEach(function(el, id, all){
      status[id] = CONSTANTS.get('STATES').pristine;
      pred[id] = [];
    });
    for (var i = 0; i < vertices.length; i++) {
      var vertex = vertices[i];
      if(status[vertex.id] == CONSTANTS.get('STATES').pristine)
        this.visita(vertex, status, timer, discoveryTime, finishTime, pred);
    }

    var report = new DFSReport(vertices, discoveryTime, finishTime, _.clone(pred));
    report.print();

    return report;
  };

  this.visita = function(vertex, status, timer, discoveryTime, finishTime, pred){
    status[vertex.id] = CONSTANTS.get('STATES').visited;
    timer.time++;
    discoveryTime[vertex.id] = _.clone(timer.time);

    var edges = this.getVertexEdges(vertex);
    for (var i = 0; i < edges.length; i++) {
      var destination = edges[i].destination;
      if( status[destination.id] === CONSTANTS.get('STATES').pristine ){
        pred[destination.id].push(vertex);
        this.visita(destination, status, timer, discoveryTime, finishTime, pred);
      }else if(status[destination.id] !== CONSTANTS.get('STATES').finished){
        pred[destination.id].push(vertex);
      }
    }

    status[vertex.id] = CONSTANTS.get('STATES').finished;
    timer.time++;
    finishTime[vertex.id] = timer.time;
  };

};
