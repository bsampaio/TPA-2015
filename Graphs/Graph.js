
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

  this.depthSearch = function (source, destination, print){

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

      //insere no inicio
      finished.unshift(src);
    };

    find(this, source, destination, 0);

    if (print) {
      var v = this.vertices.all();
      console.log("Vertice |   Pred. ");
      for (var i = 0; i < v.length; i++) {
        var vid = v[i].id;
        console.log(JSON.stringify(v[i].name)+" \t| \t"+JSON.stringify(_.uniq(_.pluck(p[vid],'name'))));
      }
    }

    return finished;
  };


  this.initUniqOrigin = function(source){
    var pt = new PrecursorTable();
    pt.init(_.clone(source), _.clone(this.vertices.all()));
    return pt;
  };

  this.BellmanFord = function(source){
    var pt = this.initUniqOrigin(source);
    var edges = this.edges.all();
    for (var i = 0; i < pt.lines.length; i++) {
      for (var j = 0; j < edges.length; j++) {
        pt.newRelax(edges[j]);
      }
    }

    for (var k = 0; k < edges.length; k++) {
      var dCost = pt.getCost(edges[k].destination);
      var sCost =  pt.getCost(edges[k].source)+edges[k].cost;
      if (dCost > sCost) {
        throw new Error('Parece que temos ciclos negativos :\'( ');
      }
    }

    pt.printTable();
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

    console.log("Vertice |   Pred. ");
    for (var j = 0; j < vertices.length; j++) {
      var vid = vertices[j].id;
      console.log(JSON.stringify(vertices[j].name)+" \t| \t"+JSON.stringify(p[vid].name));
    }
  };

  this.GAO = function(source){
    var pt = this.initUniqOrigin(source);
    var lot = this.depthSearch(source);

    for (var i = 0; i < lot.length; i++) {
      var adj = this.getVertexEdges(lot[i]);
      for (var j = 0; j < adj.length; j++) {
        var edge = adj[j];
        pt.newRelax(edge);
      }
    }

    pt.printTable();
    return pt;
  };

  var removeMenor = function(Q, custo){
    var min = _.first(Q);
    var mId;
    if(min){
      mId = min.id;
      min = custo[min.id];
    }

    for (var i = 0; i < Q.length; i++) {
      var vCost = custo[Q[i].id];
      if(vCost < min){
        min = vCost;
        mId = Q[i].id;
      }
    }

    return _.remove(Q, function(el){
      return el.id === mId;
    });
  };

  this.Prim = function(source, print){
    var custo = [];
    var p = [];
    var Q = [];
    var vertices = _.clone(this.vertices.all());
    vertices.forEach(function(el, id, arr){
      custo[el.id] = Infinity;
      p[el.id] = undefined;
    });
    custo[source.id] = 0;
    Q = _.clone(this.vertices.all());
    while (! _.isEmpty(Q)){
      var u = _.first(removeMenor(Q, custo));
      if(u){
        var edges = this.getVertexEdges(u);
        var adj = _.pluck(edges, 'destination');
        for (var i = 0; i < adj.length; i++) {
          var v = adj[i];
          if(_.some(Q, v) && edges[i].cost < custo[v.id]){
            p[v.id] = u;
            custo[v.id] = edges[i].cost;
          }
        }
      }
    }

    if(print){
      var stf = function(obj){
        if(obj !== null && !_.isUndefined(obj))
          return JSON.stringify(obj.name);
      };
      console.log("Vertice: \t| Custo: \t| Pred. ");
      for (var j = 0; j < vertices.length; j++) {
        console.log(stf(vertices[j])+" \t\t| "+custo[j]+" \t\t| "+stf(p[j]));
      }
    }
  };
};
