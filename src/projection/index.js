import clipAntimeridian from "../clip/antimeridian";
import clipCircle from "../clip/circle";
import clipRectangle from "../clip/rectangle";
import compose from "../compose";
import identity from "../identity";
import {cos, degrees, radians, sin, sqrt} from "../math";
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
      x = 480, y = 250, // translate
      dx, dy, lambda = 0, phi = 0, // center
      deltaLambda = 0, deltaPhi = 0, deltaGamma = 0, rotate, projectRotate, // rotate
      angle = 0, a, b, // angle
      linearTransform, // center + scale + angle
      theta = null, preclip = clipAntimeridian, // clip angle
      x0 = null, y0, x1, y1, postclip = identity, // clip extent
      delta2 = 0.5, projectResample = resample(projectTransform, delta2), // precision
      cache,
      cacheStream;

  function projection(point) {
    return linearTransform(projectRotate(point[0] * radians, point[1] * radians));
  }

  function invert(point) {
    point = linearTransform.invert(point);
    point = projectRotate.invert(point[0], point[1]);
    return point && [point[0] * degrees, point[1] * degrees];
  }

  function projectTransform(x, y) {
    return linearTransform(project(x, y));
  }

  function recenter() {
    projectRotate = compose(rotate = rotateRadians(deltaLambda, deltaPhi, deltaGamma), project);
    var ar = angle * radians;
    a = cos(ar);
    b = -sin(ar);
    linearTransform = setTransform();
    dx = 0; dy = 0;
    var center = linearTransform(project(lambda, phi));
    dx = x - center[0];
    dy = y - center[1];
    return reset();
  }

  function setTransform() {
    var f;
    if (a === 1) {
      f = function(point) {
        return [ dx + k * point[0], dy - k * point[1] ];
      };
      f.invert = function (point) {
        return [ (point[0] - dx) / k, (dy - point[1]) / k ];
      }
    }
    else {
      f = function(point) {
        var x = point[0],
            y = point[1];
        return [ dx + k * (x * a + y * b), dy + k * (x * b - y * a) ];
      };
      f.invert = function (point) {
        var x = (point[0] - dx) / k,
            y = (dy - point[1]) / k;
        return [ a * x - b * y, b * x + a * y ];
      }
    }
    return f;
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
    return arguments.length ? (x = +_[0], y = +_[1], recenter()) : [x, y];
  };

  projection.center = function(_) {
    return arguments.length ? (lambda = _[0] % 360 * radians, phi = _[1] % 360 * radians, recenter()) : [lambda * degrees, phi * degrees];
  };

  projection.rotate = function(_) {
    return arguments.length ? (deltaLambda = _[0] % 360 * radians, deltaPhi = _[1] % 360 * radians, deltaGamma = _.length > 2 ? _[2] % 360 * radians : 0, recenter()) : [deltaLambda * degrees, deltaPhi * degrees, deltaGamma * degrees];
  };

  projection.angle = function(_) {
    return arguments.length ? (angle = ((+_ % 360) + 360 + 180) % 360 - 180, recenter()) : angle;
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
