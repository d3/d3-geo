import {abs, epsilon2} from "./math";
import {cartesianCross, cartesianDot, cartesianNormalizeInPlace} from "./cartesian";

export function intersectSegment(from, to) {
  this.from = from, this.to = to;
  this.normal = cartesianCross(from, to);
  this.fromNormal = cartesianCross(this.normal, from);
  this.toNormal = cartesianCross(this.normal, to);
}


// >> here a and b are segments processed by intersectSegment
export function intersect(a, b) {
  var axb = cartesianCross(a.normal, b.normal);
  cartesianNormalizeInPlace(axb);
  var a0 = cartesianDot(axb, a.fromNormal),
      a1 = cartesianDot(axb, a.toNormal),
      b0 = cartesianDot(axb, b.fromNormal),
      b1 = cartesianDot(axb, b.toNormal);

  if (a0 > -epsilon2 && a1 < epsilon2 && b0 > -epsilon2 && b1 < epsilon2) return axb;

  if (a0 < epsilon2 && a1 > -epsilon2 && b0 < epsilon2 && b1 > -epsilon2) {
    axb[0] = -axb[0], axb[1] = -axb[1], axb[2] = -axb[2];
    return axb;
  }
}

export function intersectPointOnLine(p, a) {
  var a0 = cartesianDot(p, a.fromNormal),
      a1 = cartesianDot(p, a.toNormal);
  p = cartesianDot(p, a.normal);

  return abs(p) < epsilon2 && (a0 > -epsilon2 && a1 < epsilon2 || a0 < epsilon2 && a1 > -epsilon2);
}

export var intersectCoincident = {};


// todo: publicly expose d3.geoIntersect(segment0, segment1) ??
// cf. https://github.com/d3/d3/commit/3dbdf87974dc2588c29db0533a8500ccddb25daa#diff-65daf69cea7d039d72c1eca7c13326b0
