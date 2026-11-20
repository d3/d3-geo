import assert from "node:assert";
import {it} from "vitest";
import {geoAzimuthalEqualAreaRaw, geoAzimuthalEquidistantRaw, geoRotation, geoStereographicRaw} from "d3-geo";

// Close to the poles, asin() of a value close to 1 loses half the digits; close
// to the centre, acos(cos(c)) rounds small c to 0. Expected values are from a
// 50-digit computation on the same double inputs; results are compared as
// angular distances on the unit sphere (radians, or degrees for geoRotation).
const cases = [
  ["inverse", geoStereographicRaw, 2.955202038516511e-09, 0.9999999904466351, 0.29999999921595566, 1.5707963167948966],
  ["inverse", geoAzimuthalEqualAreaRaw, 4.179286822385794e-09, 1.414213555617846, 0.2999999986701156, 1.5707963167948966],
  ["inverse", geoAzimuthalEquidistantRaw, 4.642020523153318e-09, 1.5707963172415318, 0.3000000021095653, 1.5707963167948966],
  ["forward", geoAzimuthalEquidistantRaw, 1e-08, 5e-09, 1e-08, 5e-09],
  ["rotationInverse", [10, 40], 179.9999999, 50.000000076604444, 30.00000348570839, 89.9999999],
  ["rotation", [0, -40], 179.99999992221382, 50.00000008660254, 29.99999438258478, 89.9999999]
];

const radians = Math.PI / 180;

function distance(l1, p1, l2, p2) {
  const a = Math.sin((p2 - p1) / 2), b = Math.sin((l2 - l1) / 2);
  return 2 * Math.asin(Math.sqrt(a * a + Math.cos(p1) * Math.cos(p2) * b * b));
}

const names = [
  [geoAzimuthalEqualAreaRaw, "geoAzimuthalEqualAreaRaw"],
  [geoAzimuthalEquidistantRaw, "geoAzimuthalEquidistantRaw"],
  [geoStereographicRaw, "geoStereographicRaw"]
];

for (const [kind, f, a, b, ea, eb] of cases) {
  const name = Array.isArray(f) ? `geoRotation([${f}])` : names.find(([g]) => g === f)[1];
  it(`precision: ${kind} ${name} (${a}, ${b})`, () => {
    let r, err;
    switch (kind) {
      case "inverse": r = f.invert(a, b); err = distance(r[0], r[1], ea, eb); break;
      case "forward": r = f(a, b); err = Math.hypot(r[0] - ea, r[1] - eb); break;
      case "rotation": r = geoRotation(f)([a, b]); err = distance(r[0] * radians, r[1] * radians, ea * radians, eb * radians); break;
      case "rotationInverse": r = geoRotation(f).invert([a, b]); err = distance(r[0] * radians, r[1] * radians, ea * radians, eb * radians); break;
    }
    assert(err < 1e-12, `${r} should be ${[ea, eb]}`);
  });
}
