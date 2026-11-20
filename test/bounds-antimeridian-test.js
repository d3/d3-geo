import assert from "node:assert";
import {it} from "vitest";
import {geoBounds} from "d3-geo";
import {assertInDelta} from "./asserts.js";

// Fiji polygon from #243, with both representations of the antimeridian.
const fiji = [
  [180, -16.54001385310727],
  [179.9855998559986, -16.541749856561054],
  [179.9855998559986, -16.522653818569424],
  [-180, -16.48966975294752],
  [-179.94239942399423, -16.441061656241544],
  [-179.89919899198992, -16.43238163897263],
  [-179.9279992799928, -16.479253732224805],
  [-179.9279992799928, -16.503557780577793],
  [-180, -16.54001385310727]
];
const fijiBounds = [
  [179.9855998559986, -16.541749856561054],
  [-179.89919899198992, -16.43238163897263]
];

for (let start = 0; start < fiji.length; ++start) {
  const ring = fiji.slice(start).concat(fiji.slice(0, start));
  ring.push(ring[0]);

  it(`bounds: antimeridian Polygon starting at vertex ${start}`, () => {
    assertInDelta(geoBounds({type: "Polygon", coordinates: [ring]}), fijiBounds, 1e-10);
  });

  it(`bounds: antimeridian MultiPolygon starting at vertex ${start}`, () => {
    assertInDelta(geoBounds({type: "MultiPolygon", coordinates: [[ring]]}), fijiBounds, 1e-10);
  });

  it(`bounds: antimeridian LineString starting at vertex ${start}`, () => {
    assertInDelta(geoBounds({type: "LineString", coordinates: ring}), fijiBounds, 1e-10);
    assertInDelta(geoBounds({type: "LineString", coordinates: ring.slice().reverse()}), fijiBounds, 1e-10);
  });

  it(`bounds: reversed antimeridian Polygon starting at vertex ${start}`, () => {
    assert.deepStrictEqual(geoBounds({type: "Polygon", coordinates: [ring.slice().reverse()]}), [[-180, -90], [180, 90]]);
  });
}

for (const coordinates of [
  [[179, 0], [180, 0], [-180, 0], [-179, 0]],
  [[179, 0], [-180, 0], [-179, 0], [180, 0], [179, 0]],
  [[-179, 0], [-180, 0], [180, 0], [179, 0]],
  [[-179, 0], [180, 0], [179, 0], [-180, 0], [-179, 0]]
]) {
  it(`bounds: LineString crosses or retraces the antimeridian ${JSON.stringify(coordinates)}`, () => {
    assert.deepStrictEqual(geoBounds({type: "LineString", coordinates}), [[179, 0], [-179, 0]]);
  });
}

for (const direction of [1, -1]) {
  it(`bounds: LineString retains a complete equatorial circuit in direction ${direction}`, () => {
    const coordinates = [-180, -90, 0, 90, 180, -180, -90, 0].map(lambda => [lambda * direction, 0]);
    assert.deepStrictEqual(geoBounds({type: "LineString", coordinates}), [[-180, 0], [180, 0]]);
  });
}
