
module.exports = Set = function(data){
	this.data = data;
}

Set.prototype.contains = function(target){
	return contains(this.data, target);
}

Set.prototype.with = function(set){
	var data = this.data + set.data;
	return new Set(data);
}

function each(arr, fn){
	var i = 0, l = arr.length;
	for(i; i < l; i++){
		fn(arr[i], i);
	}
}

function contains(arr, target){
	var result = false;
	each(arr, function(item){
		if(item === target){
			result = true;
		}
	})
	return result;
}