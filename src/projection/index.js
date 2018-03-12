import clipAntimeridian from "../clip/antimeridian";
import clipCircle from "../clip/circle";
import clipRectangle from "../clip/rectangle";
import compose from "../compose";
import identity from "../identity";
import {degrees, radians, sqrt} from "../math";
import {rotateRadians} from "../rotation";
import {transformer} from "../transform";
import {fitExtent, fitSize, fitWidth, fitHeight} from "./fit";
import resample from "./resample";

var transformRadians = transformer({
  point: function(x, y) {
    this.stream.point(x * radians, y * radians);
  }
});

function transformRotate(rotate) {
  return transformer({
    point: function(x, y) {
      var r = rotate(x, y);
      return this.stream.point(r[0], r[1]);
    }
  });
}

export default function projection(project) {
  return projectionMutator(function() { return project; })();
}

export function projectionMutator(projectAt) {
  var project,
      k = 150, // scale
      tx = 480, ty = 250, // translate
      lambda = 0, phi = 0, // center
      deltaLambda = 0, deltaPhi = 0, deltaGamma = 0, rotate, projectRotate, // pre-rotate
      a, b, c, d, e, f, // post-projection transform
      A, B, C, D, E, F, // inverse post-projection transform
      theta = null, preclip = clipAntimeridian, // clip angle
      x0 = null, y0, x1, y1, postclip = identity, // clip extent
      delta2 = 0.5, projectResample = resample(projectTransform, delta2), // precision
      cache,
      cacheStream;

  function projection(point) {
    point = projectRotate(point[0] * radians, point[1] * radians);
    var x = point[0], y = point[1];
    return [a * x + b * y + c, d * x + e * y + f];
  }

  function invert(point) {
    var x = point[0], y = point[1];
    point = projectRotate.invert(A * x + B * y + C, D * x + E * y + F);
    return point && [point[0] * degrees, point[1] * degrees];
  }

  function projectTransform(x, y) {
    var point = project(x, y);
    x = point[0], y = point[1];
    return [a * x + b * y + c, d * x + e * y + f];
  }

  projection.stream = function(stream) {
    return cache && cacheStream === stream ? cache : cache = transformRadians(transformRotate(rotate)(preclip(projectResample(postclip(cacheStream = stream)))));
  };

  projection.preclip = function(_) {
    return arguments.length ? (preclip = _, theta = undefined, reset()) : preclip;
  };

  projection.postclip = function(_) {
    return arguments.length ? (postclip = _, x0 = y0 = x1 = y1 = null, reset()) : postclip;
  };

  projection.clipAngle = function(_) {
    return arguments.length ? (preclip = +_ ? clipCircle(theta = _ * radians) : (theta = null, clipAntimeridian), reset()) : theta * degrees;
  };

  projection.clipExtent = function(_) {
    return arguments.length ? (postclip = _ == null ? (x0 = y0 = x1 = y1 = null, identity) : clipRectangle(x0 = +_[0][0], y0 = +_[0][1], x1 = +_[1][0], y1 = +_[1][1]), reset()) : x0 == null ? null : [[x0, y0], [x1, y1]];
  };

  projection.scale = function(_) {
    return arguments.length ? (k = +_, recenter()) : k;
  };

  projection.translate = function(_) {
    return arguments.length ? (tx = +_[0], ty = +_[1], recenter()) : [tx, ty];
  };

  projection.center = function(_) {
    return arguments.length ? (lambda = _[0] % 360 * radians, phi = _[1] % 360 * radians, recenter()) : [lambda * degrees, phi * degrees];
  };

  projection.rotate = function(_) {
    return arguments.length ? (deltaLambda = _[0] % 360 * radians, deltaPhi = _[1] % 360 * radians, deltaGamma = _.length > 2 ? _[2] % 360 * radians : 0, recenter()) : [deltaLambda * degrees, deltaPhi * degrees, deltaGamma * degrees];
  };

  projection.precision = function(_) {
    return arguments.length ? (projectResample = resample(projectTransform, delta2 = _ * _), reset()) : sqrt(delta2);
  };

  projection.fitExtent = function(extent, object) {
    return fitExtent(projection, extent, object);
  };

  projection.fitSize = function(size, object) {
    return fitSize(projection, size, object);
  };

  projection.fitWidth = function(width, object) {
    return fitWidth(projection, width, object);
  };

  projection.fitHeight = function(height, object) {
    return fitHeight(projection, height, object);
  };

  function recenter() {
    projectRotate = compose(rotate = rotateRadians(deltaLambda, deltaPhi, deltaGamma), project);
    var center = project(lambda, phi), cx = center[0], cy = center[1];
    // | a b c | | x | = | x * k + tx - cx * k  |
    // | d e f | | y |   | y * -k + ty + cy * k |
    // | 0 0 1 | | 1 |   | 1                    |
    a = k, b = 0, c = tx - cx * k;
    d = 0, e = -k, f = ty + cy * k;
    // | A B C | | x | = | x / k - tx / k + cx  |
    // | D E F | | y |   | y / -k + ty / k + cy |
    // | 0 0 1 | | 1 |   | 1                    |
    A = 1 / k, B = 0, C = -tx / k - cx;
    D = 0, E = -A, F = ty / k + cy;
    return reset();
  }

  function reset() {
    cache = cacheStream = null;
    return projection;
  }

  return function() {
    project = projectAt.apply(this, arguments);
    projection.invert = project.invert && invert;
    return recenter();
  };
}
