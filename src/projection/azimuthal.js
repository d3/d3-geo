import {atan2, cos, sin, sqrt} from "../math.js";

export function azimuthalRaw(scale) {
  return function(x, y) {
    var cx = cos(x),
        cy = cos(y),
        k = scale(cx * cy);
        if (k === Infinity) return [2, 0];
    return [
      k * cy * sin(x),
      k * sin(y)
    ];
  }
}

export function azimuthalInvert(angle) {
  return function(x, y) {
    var z = sqrt(x * x + y * y),
        c = angle(z),
        sc = sin(c),
        cc = cos(c);
    // asin(y * sc / z), but from atan2() so that it stays accurate close to
    // the poles, where asin() of a value close to 1 loses half the digits
    return [
      atan2(x * sc, z * cc),
      atan2(y * sc, sqrt(x * x * sc * sc + z * z * cc * cc))
    ];
  }
}
