var tape = require("tape"),
    d3 = require("../../");

tape("test angles", function(test) {
  var projection = d3.geoGnomonic().scale(1).translate([0, 0]);
  test.deepEqual(projection([0,0]), [0,0]);
  test.equal(projection([10,0])[1], 0);
  projection.angle(30);
  test.deepEqual(projection([0,0]), [0,0]);
  test.equal(projection.angle(), 30);
  test.inDelta(projection([10,0])[1], -0.08816349, 1e-6);
  test.inDelta(projection.invert(projection([12.3,5]))[0], 12.3, 1e-6);
  projection.angle(180);
  test.inDelta(projection([10,0])[1], 0, 1e-12);
  test.equal(projection.angle(), -180);
  projection.angle(5702);
  test.equal(projection.angle(), -58);
  test.end();
});
