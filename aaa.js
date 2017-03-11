var array = [];
var object = {};

for(var i = 0; i < 10000000; i++) {
  array[i] = i;
  object.i = i;
}

var b;

var date = Date.parse(new Date());


for(var j = 0; j < 1000; j++) {
  for(var i = 0; i < 10000098; i++) {
    b = array[i];
  }
}

var adate = Date.parse(new Date());


console.log(adate - date);


var bdate = Date.parse(new Date());

for(var j = 0; j < 1000; j++) {
  for(var i = 0; i < 10000098; i++) {
    b = object.i;
  }
}
var cdate = Date.parse(new Date());

console.log(cdate - bdate);
