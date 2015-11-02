var _ = require('./Util.js');

module.exports = Set = function(data){
	this.data = data;
}

Set.prototype.contains = function(target){
	return _.contains(this.data, target);
}

Set.prototype.with = function(set){
	var data = this.data + set.data;
	return new Set(data);
}
