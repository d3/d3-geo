var tape = require("tape"),
    d3 = require("../../");

tape("clipAngle restricts projection", function(test) {
  var projection = d3.geoAzimuthalEquidistant().clipAngle(10);
  var path = d3.geoPath()
    .projection(projection);
  test.ok(!!path({type:"Point", coordinates:[0,9]}));
  test.ok(!path({type:"Point", coordinates:[0,11]}));
  test.end();
});

tape("clipAntimeridian clips line", function(test) {
  // we use .clipAngle(10).clipAntimeridian(true) to unset and reset Antimeridian clip
  var projection = d3.geoEquirectangular().clipAngle(10).clipAntimeridian(true);
  var path = d3.geoPath()
    .projection(projection);
  test.equal((path({type:"LineString", coordinates:[[-170,0], [170,0]]}) + "").split(/M/).length, 3);
  test.end();
});

tape("clipPolygon clips line", function(test) {
  var projection = d3.geoEquirectangular().clipAngle(10).clipPolygon([[[-10, -10], [-10, 10], [10, 10], [10, -10], [-10, -10],]]);
  var path = d3.geoPath()
    .projection(projection);
  test.equal(path({type:"LineString", coordinates:[[-20,0], [20,0]]}), path({type:"LineString", coordinates:[[-10.5,0], [10.5,0]]}));
  test.end();
});

tape("clipAngle should not crash on exact point (#54)", function(test) {
  var projection = d3.geoGnomonic()
    .scale(150)
    .rotate([-105, 0, 0]);
  var path = d3.geoPath()
    .projection(projection);
  var graticule = d3.geoGraticule()
    .step([15, 15]);
  test.ok(!!path(graticule()));
  test.end();
});
