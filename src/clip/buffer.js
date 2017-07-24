import noop from "../noop";

export default function() {
  var lines = [],
      line;
  return {
    point: function(x, y, i, t) {
      var point = [x, y];
      // when called by clipPolygon, store index and t
      if (arguments.length > 2) { point.index = i; point.t = t; }
      line.push(point);
    },
    lineStart: function() {
      lines.push(line = []);
    },
    lineEnd: noop,
    rejoin: function() {
      if (lines.length > 1) lines.push(lines.pop().concat(lines.shift()));
    },
    result: function() {
      var result = lines;
      lines = [];
      line = null;
      return result;
    }
  };
}
