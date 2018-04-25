var tape = require("tape"),
    d3 = require("../../");

require("../inDelta");

tape("azimuthalRaw(1) is orthographic", function(test) {
  var raw = d3.geoAzimuthalRaw(function() { return 1; }),
    proj0 = d3.geoOrthographic(),
    projection = d3.geoProjection(raw).scale(proj0.scale());
  var p0 = projection([10,5]),
    p1 = proj0([10,5]);
  test.inDelta(p0[0], p1[0], 1e-12);
  test.inDelta(p0[1], p1[1], 1e-12);
  test.end();
});

tape("azimuthalInvert(r) is equidistant", function(test) {
  var raw = d3.geoAzimuthalRaw(function(c) {
    return (c = Math.acos(c)) && c / Math.sin(c);
  });
  raw.invert = d3.geoAzimuthalInvert(function(r) { return r; });
  var proj0 = d3.geoAzimuthalEquidistant(),
    projection = d3.geoProjection(raw).scale(proj0.scale());
  var p0 = projection.invert([490,255]),
    p1 = proj0.invert([490,255]);
  test.inDelta(p0[0], p1[0], 1e-12);
  test.inDelta(p0[1], p1[1], 1e-12);
  test.end();
});
