
_ = require('lodash');

module.exports = function(){

  this.collection = [];
  this.length = 0;

  this.add = function (item){
    if (this.exists(item))
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

  this.exists = function(item){
    return _.some(this.collection, item);
  };

  var inBounds = function (self, value){
    return (value >= 0 && value < self.collection.length);
  };

  this.replace = function(index, item){
    if(! inBounds(this, index))
      return;

      this.collection[index] = item;
  };
};
