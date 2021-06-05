import assert from "assert";
import {geoAlbers, geoEquirectangular, geoPath} from "../../src/index.js";
import {testContext} from "./test-context.js";

const equirectangular = geoEquirectangular()
    .scale(900 / Math.PI)
    .precision(0);

function testPath(projection, object) {
  const context = testContext();

  geoPath()
      .projection(projection)
      .context(context) (object);

  return context.result();
}

it("geoPath.projection() defaults to null", () => {
  const path = geoPath();
  assert.strictEqual(path.projection(), null);
});

it("geoPath.context() defaults to null", () => {
  const path = geoPath();
  assert.strictEqual(path.context(), null);
});

it("geoPath(projection) sets the initial projection", () => {
  const projection = geoAlbers(), path = geoPath(projection);
  assert.strictEqual(path.projection(), projection);
});

it("geoPath(projection, context) sets the initial projection and context", () => {
  const context = testContext(), projection = geoAlbers(), path = geoPath(projection, context);
  assert.strictEqual(path.projection(), projection);
  assert.strictEqual(path.context(), context);
});

it("geoPath(Point) renders a point", () => {
  assert.deepStrictEqual(testPath(equirectangular, {
    type: "Point",
    coordinates: [-63, 18]
  }), [
    {type: "moveTo", x: 170, y: 160},
    {type: "arc", x: 165, y: 160, r: 4.5}
  ]);
});

it("geoPath(MultiPoint) renders a point", () => {
  assert.deepStrictEqual(testPath(equirectangular, {
    type: "MultiPoint",
    coordinates: [[-63, 18], [-62, 18], [-62, 17]]
  }), [
    {type: "moveTo", x: 170, y: 160}, {type: "arc", x: 165, y: 160, r: 4.5},
    {type: "moveTo", x: 175, y: 160}, {type: "arc", x: 170, y: 160, r: 4.5},
    {type: "moveTo", x: 175, y: 165}, {type: "arc", x: 170, y: 165, r: 4.5}
  ]);
});

it("geoPath(LineString) renders a line string", () => {
  assert.deepStrictEqual(testPath(equirectangular, {
    type: "LineString",
    coordinates: [[-63, 18], [-62, 18], [-62, 17]]
  }), [
    {type: "moveTo", x: 165, y: 160},
    {type: "lineTo", x: 170, y: 160},
    {type: "lineTo", x: 170, y: 165}
  ]);
});

it("geoPath(Polygon) renders a polygon", () => {
  assert.deepStrictEqual(testPath(equirectangular, {
    type: "Polygon",
    coordinates: [[[-63, 18], [-62, 18], [-62, 17], [-63, 18]]]
  }), [
    {type: "moveTo", x: 165, y: 160},
    {type: "lineTo", x: 170, y: 160},
    {type: "lineTo", x: 170, y: 165},
    {type: "closePath"}
  ]);
});

it("geoPath(GeometryCollection) renders a geometry collection", () => {
  assert.deepStrictEqual(testPath(equirectangular, {
    type: "GeometryCollection",
    geometries: [{
      type: "Polygon",
      coordinates: [[[-63, 18], [-62, 18], [-62, 17], [-63, 18]]]
    }]
  }), [
    {type: "moveTo", x: 165, y: 160},
    {type: "lineTo", x: 170, y: 160},
    {type: "lineTo", x: 170, y: 165},
    {type: "closePath"}
  ]);
});

it("geoPath(Feature) renders a feature", () => {
  assert.deepStrictEqual(testPath(equirectangular, {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [[[-63, 18], [-62, 18], [-62, 17], [-63, 18]]]
    }
  }), [
    {type: "moveTo", x: 165, y: 160},
    {type: "lineTo", x: 170, y: 160},
    {type: "lineTo", x: 170, y: 165},
    {type: "closePath"}
  ]);
});

it("geoPath(FeatureCollection) renders a feature collection", () => {
  assert.deepStrictEqual(testPath(equirectangular, {
    type: "FeatureCollection",
    features: [{
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [[[-63, 18], [-62, 18], [-62, 17], [-63, 18]]]
      }
    }]
  }), [
    {type: "moveTo", x: 165, y: 160},
    {type: "lineTo", x: 170, y: 160},
    {type: "lineTo", x: 170, y: 165},
    {type: "closePath"}
  ]);
});

it("geoPath(…) wraps longitudes outside of ±180°", () => {
  assert.deepStrictEqual(testPath(equirectangular, {
    type: "Point",
    coordinates: [180 + 1e-6, 0]
  }), [
    {type: "moveTo", x: -415, y: 250},
    {type: "arc", x: -420, y: 250, r: 4.5}
  ]);
});

it("geoPath(…) observes the correct winding order of a tiny polygon", () => {
  assert.deepStrictEqual(testPath(equirectangular, {
    type: "Polygon",
    coordinates: [[
      [-0.06904102953339501, 0.346043661846373],
      [-6.725674252975136e-15, 0.3981303360336475],
      [-6.742247658534323e-15, -0.08812465346531581],
      [-0.17301258217724075, -0.12278150669440671],
      [-0.06904102953339501, 0.346043661846373]
    ]]
  }), [
    {type: "moveTo", x: 480, y: 248},
    {type: "lineTo", x: 480, y: 248},
    {type: "lineTo", x: 480, y: 250},
    {type: "lineTo", x: 479, y: 251},
    {type: "closePath"}
  ]);
});

it("geoPath.projection(null)(…) does not transform coordinates", () => {
  assert.deepStrictEqual(testPath(null, {
    type: "Polygon",
    coordinates: [[[-63, 18], [-62, 18], [-62, 17], [-63, 18]]]
  }), [
    {type: "moveTo", x: -63, y: 18},
    {type: "lineTo", x: -62, y: 18},
    {type: "lineTo", x: -62, y: 17},
    {type: "closePath"}
  ]);
});

it("geoPath.context(null)(null) returns null", () => {
  const path = geoPath();
  assert.strictEqual(path(), null);
  assert.strictEqual(path(null), null);
  assert.strictEqual(path(undefined), null);
});

it("geoPath.context(null)(Unknown) returns null", () => {
  const path = geoPath();
  assert.strictEqual(path({type: "Unknown"}), null);
  assert.strictEqual(path({type: "__proto__"}), null);
});

it("geoPath(LineString) then geoPath(Point) does not treat the point as part of a line", () => {
  const context = testContext(), path = geoPath().projection(equirectangular).context(context);
  path({
    type: "LineString",
    coordinates: [[-63, 18], [-62, 18], [-62, 17]]
  });
  assert.deepStrictEqual(context.result(), [
    {type: "moveTo", x: 165, y: 160},
    {type: "lineTo", x: 170, y: 160},
    {type: "lineTo", x: 170, y: 165}
  ]);
  path({
    type: "Point",
    coordinates: [-63, 18]
  });
  assert.deepStrictEqual(context.result(), [
    {type: "moveTo", x: 170, y: 160},
    {type: "arc", x: 165, y: 160, r: 4.5}
  ]);
});
