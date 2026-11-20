import {atan2, cos, sin, sqrt} from "../math.js";
import {azimuthalInvert} from "./azimuthal.js";
import projection from "./index.js";

// c / sin(c) times the direction, where c is the angular distance from the
// centre. sin(c) and c are taken from sqrt() and atan2(): acos(cos(c)) lost
// half the digits close to the centre.
export function azimuthalEquidistantRaw(x, y) {
  var cy = cos(y),
      u = cy * sin(x),
      v = sin(y),
      sc = sqrt(u * u + v * v),
      k = sc ? atan2(sc, cy * cos(x)) / sc : 1;
  return [k * u, k * v];
}

azimuthalEquidistantRaw.invert = azimuthalInvert(function(z) {
  return z;
});

export default function() {
  return projection(azimuthalEquidistantRaw)
      .scale(79.4188)
      .clipAngle(180 - 1e-3);
}
