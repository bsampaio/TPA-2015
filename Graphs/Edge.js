
/**
 * Representa a classe de Arestas
 * e seu comportamento.
 * @constructor
 * @param {Vertex} source - Origem da aresta
 * @param {Vertex} destination - Destino da aresta
 * @param {float} cost - Custo do caminho
 */
var Edge = function(source, destination, cost){

  this.source = source;
  this.destination = destination;
  this.cost = cost;
};


module.exports = Edge;
