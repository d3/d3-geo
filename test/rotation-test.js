var tape = require("tape"),
    d3 = require("../");
  
require("./inDelta");

tape("a rotation of [+90°, 0°] only rotates longitude", function(test) {
  var rotation = d3.geoRotation([90, 0])([0, 0]);
  test.inDelta(rotation[0], 90, 1e-6);
  test.inDelta(rotation[1], 0, 1e-6);
  test.end();
});

tape("a rotation of [+90°, 0°] wraps around when crossing the antimeridian", function(test) {
  var rotation = d3.geoRotation([90, 0])([150, 0]);
  test.inDelta(rotation[0], -120, 1e-6);
  test.inDelta(rotation[1], 0, 1e-6);
  test.end();
});

tape("a rotation of [-45°, -45°] rotates longitude and latitude", function(test) {
  var rotation = d3.geoRotation([-45, 45])([0, 0]);
  test.inDelta(rotation[0], -54.73561, 1e-6);
  test.inDelta(rotation[1], 30, 1e-6);
  test.end();
});

tape("a rotation of [-45°, -45°] inverse rotation of longitude and latitude", function(test) {
  var rotation = d3.geoRotation([-45, 45]).invert([-54.73561, 30]);
  test.inDelta(rotation[0], 0, 1e-6);
  test.inDelta(rotation[1], 0, 1e-6);
  test.end();
});

tape("a rtation of a degenerate polygon should not break",
function(test) {
  var feature = {
    "type": "Polygon",
    "coordinates": [
      [
        [125.67351590459046, -14.17673705310531],
        [125.67351590459046, -14.173276873687367],
        [125.67351590459046, -14.173276873687367],
        [125.67351590459046, -14.169816694269425],
        [125.67351590459046, -14.17673705310531]
      ]
    ]
  };

  var projection = d3.geoMercator()
    .rotate([-134.300, 25.776])
    .scale(750)
    .translate([0, 0]),
    path = d3.geoPath(projection),
    d = path(feature).replace(/\.\d+/g,'');

  test.equal(d, "M-111,-149L-111,-149L-111,-149L-111,-149Z");
  test.end();

});