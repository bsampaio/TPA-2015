
_ = require('lodash');

module.exports = function(){

  this.collection = [];
  this.length = 0;

  this.add = function (item){
    if (exists(this.collection, item))
      return;

    this.collection.push(item);
    this.length++;
  };

  this.get = function (index){
    if(index > this.collection.length-1)
      return;

    return this.collection[index];
  };

  this.all = function (){
    return this.collection;
  };

  var exists = function(collection, item){
    return _.some(collection, item);
  };
};
