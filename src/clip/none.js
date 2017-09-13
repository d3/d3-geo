/*
 * clipNone generates a clip function which doesn't clip
 * but complies with the preclip API by applying the rotation
 *
 */

export default function() {

  return function(rotate, stream) {
    var _stream = {
      point: function(x,y) {
        var r = rotate(x,y);
        return stream.point(r[0],r[1]);
      },
      lineStart: stream.lineStart,
      lineEnd: stream.lineEnd,
      polygonStart: stream.polygonStart,
      polygonEnd: stream.polygonEnd,
      sphere: stream.sphere
    };
    return _stream;
  }

}

/*

import {halfPi, pi} from "../math";

function sphere(stream) {
  return function() {
    var phi = 1 * halfPi;
    stream.lineStart();
    stream.point(-pi, phi);
    stream.point(0, phi);
    stream.point(pi, phi);
    stream.point(pi, 0);
    stream.point(pi, -phi);
    stream.point(0, -phi);
    stream.point(-pi, -phi);
    stream.point(-pi, 0);
    stream.point(-pi, phi);
    stream.lineEnd();
  }
}
*/
