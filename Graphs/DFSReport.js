
var _ = require('lodash');
var Set = require('./Set');
var DFSReport = function(vertices, dTimes, fTimes, precursors){

  this.addLine = function(vertex, dTime, fTime, precursors){
    this.lines.add({
      "vertex":vertex,
      "dTime":dTime,
      "fTime":fTime,
      "precursors":precursors
    });
  };

  this.lines = new Set();

  for (var i = 0; i < vertices.length; i++) {
    var v = vertices[i];
    this.addLine(v, dTimes[v.id], fTimes[v.id], precursors[v.id]);
  }


  this.print = function(){
    var lines = _.clone(this.lines.all());
    var hr = '----------------';
    console.log('\t\tTabela de Predecessores \t\t');
    console.log('|Vértice\t'+'|\tT. Visita\t'+'|\tT. Final\t|'+'\tPredecessores\t');
    console.log(hr+' '+hr+' '+hr+' '+hr+' '+hr+'\t');

    for (var i = 0; i < lines.length; i++) {
      var ptyP = _.pluck(lines[i].precursors,'name');
      var v = lines[i].vertex.name;
      var dtm = lines[i].dTime;
      var ftm = lines[i].fTime;
      console.log('|'+v+'\t\t'+'|'+dtm+'\t\t\t|'+ftm+'\t\t\t|\t'+ptyP+'\t\t|\t');
    }
    console.log('\n\n');
  };
};

module.exports = DFSReport;
