# d3-geo

…

## Installing

If you use NPM, `npm install d3-geo`. Otherwise, download the [latest release](https://github.com/d3/d3-geo/releases/latest). You can also load directly from [d3js.org](https://d3js.org), either as a [standalone library](https://d3js.org/d3-geo.v0.1.min.js) or as part of [D3 4.0](https://github.com/d3/d3). AMD, CommonJS, and vanilla environments are supported. In vanilla, a `d3` global is exported:

```html
<script src="https://d3js.org/d3-array.v1.min.js"></script>
<script src="https://d3js.org/d3-geo.v0.1.min.js"></script>
<script>

var path = d3.geoPath();

</script>
```

[Try d3-geo in your browser.](https://tonicdev.com/npm/d3-geo)

## API Reference

* [Math](#math)
* [Shapes](#shapes)
* [Projections](#projections)
* [Transforms](#transforms)
* [Tile](#tile)

### Math

<a name="geoArea" href="#geoArea">#</a> d3.<b>geoArea</b>(<i>feature</i>)

Returns the spherical area of the specified *feature* in [steradians](http://mathworld.wolfram.com/Steradian.html). See also [path.area](#path_area), which computes the projected area on the Cartesian plane.

<a name="geoBounds" href="#geoBounds">#</a> d3.<b>geoBounds</b>(<i>feature</i>)

Returns the spherical bounding box for the specified *feature*. The bounding box is represented by a two-dimensional array: [​[*left*, *bottom*], [*right*, *top*]​], where *left* is the minimum longitude, *bottom* is the minimum latitude, *right* is maximum longitude, and *top* is the maximum latitude.

<a name="geoCentroid" href="#geoCentroid">#</a> d3.<b>geoCentroid</b>(<i>feature</i>)

Returns the spherical centroid of the specified *feature*. See also [path.centroid](#path_centroid), which computes the projected centroid on the Cartesian plane.

<a name="geoDistance" href="#geoDistance">#</a> d3.<b>geoDistance</b>(<i>a</i>, <i>b</i>)

Returns the great-arc distance in radians between the two location *a* and *b*. Each location must be specified as a two-element array [*longitude*, *latitude*] in degrees.

<a name="geoLength" href="#geoLength">#</a> d3.<b>geoLength</b>(<i>feature</i>)

Returns the great-arc length of the specified *feature* in [radians](http://mathworld.wolfram.com/Radian.html). For polygons, returns the perimeter of the exterior ring plus that of any interior rings.

<a name="geoInterpolate" href="#geoInterpolate">#</a> d3.<b>geoInterpolate</b>(<i>a</i>, <i>b</i>)

Returns an interpolator given the two locations *a* and *b*. Each location must be specified as a two-element array [*longitude*, *latitude*] in degrees. The returned interpolator is a function which takes a single parameter *t* as input, where *t* ranges from 0 to 1. A value of 0 returns the location *a*, while a value of 1 returns the location *b*. Intermediate values interpolate from *a* to *b* along the spanning great arc.

<a name="geoRotation" href="#geoRotation">#</a> d3.<b>geoRotation</b>(<i>angles</i>)

Returns a rotation operator for the given *angles*, which must be a two- or three-element array of numbers [*lambda*, *phi*, *gamma*] specifying the rotation angles in degrees about [each spherical axis](http://bl.ocks.org/mbostock/4282586). If the rotation angle *gamma* is omitted, it defaults to 0.

<a name="_rotation" href="#_rotation">#</a> <i>rotation</i>(<i>location</i>)

Rotates the given *location* according to the angles specified for this rotation, in the order described above. The location must be specified as a two-element array [*longitude*, *latitude*] in degrees. Returns a new array representing the rotated location.

<a name="rotation_invert" href="#rotation_invert">#</a> <i>rotation</i>.<b>invert</b>(<i>location</i>)

Rotates the given *location* according to the angles specified for this rotation, but with the order described above reversed. The location must be specified as a two-element array [*longitude*, *latitude*] in degrees. Returns a new array representing the rotated location.

### Shapes

<a name="geoCircle" href="#geoCircle">#</a> d3.<b>geoCircle</b>()

Returns a new circle generator.

<a name="_circle" href="#_circle">#</a> <i>circle</i>(<i>arguments…</i>)

Returns a new GeoJSON geometry object of type “Polygon” approximating a circle on the surface of a sphere, with the current [center](#circle_center), [radius](#circle_radius) and [precision](#circle_precision). Any *arguments* are passed to the  accessors.

<a name="circle_center" href="#circle_center">#</a> <i>circle</i>.<b>center</b>([<i>center</i>])

If *center* is specified, sets the circle center to the specified location [*longitude*, *latitude*] in degrees, and returns this circle generator. The center may also be specified as a function; this function will be invoked whenever a circle is [generated](#_circle), being passed any arguments passed to the circle generator. If *center* is not specified, returns the current center accessor, which defaults to:

```js
function center() {
  return [0, 0];
}
```

<a name="circle_radius" href="#circle_radius">#</a> <i>circle</i>.<b>radius</b>([<i>radius</i>])

If *radius* is specified, sets the circle radius to the specified angle in degrees, and returns this circle generator. The radius may also be specified as a function; this function will be invoked whenever a circle is [generated](#_circle), being passed any arguments passed to the circle generator. If *radius* is not specified, returns the current radius accessor, which defaults to:

```js
function radius() {
  return 90;
}
```

<a name="circle_precision" href="#circle_precision">#</a> <i>circle</i>.<b>precision</b>([<i>angle</i>])

If *precision* is specified, sets the circle precision to the specified angle in degrees, and returns this circle generator. The precision may also be specified as a function; this function will be invoked whenever a circle is [generated](#_circle), being passed any arguments passed to the circle generator. If *precision* is not specified, returns the current precision accessor, which defaults to:

```js
function precision() {
  return 6;
}
```

Small circles do not follow great arcs and thus the generated polygon is only an approximation. Specifying a smaller precision angle improves the accuracy of the approximate polygon, but also increase the cost to generate and render it.

<a name="geoGraticule" href="#geoGraticule">#</a> d3.<b>geoGraticule</b>()

Constructs a feature generator for creating graticules.

<a name="_graticule" href="#_graticule">#</a> <i>graticule</i>()

Returns a MultiLineString geometry object representing all meridians and parallels for this graticule.

<a name="graticule_lines" href="#graticule_lines">#</a> <i>graticule</i>.<b>lines</b>()

Returns an array of LineString geometry objects, one for each meridian or parallel for this graticule.

<a name="graticule_outline" href="#graticule_outline">#</a> <i>graticule</i>.<b>outline</b>()

Returns a Polygon geometry object representing the outline of this graticule, i.e. along the meridians and parallels defining its extent.

<a name="graticule_extent" href="#graticule_extent">#</a> <i>graticule</i>.<b>extent</b>([<i>extent</i>])

If *extent* is specified, sets the major and minor extents of this graticule. If *extent* is not specified, returns the current minor extent, which defaults to ⟨⟨-180°, -80° - ε⟩, ⟨180°, 80° + ε⟩⟩.

<a name="graticule_extentMajor" href="#graticule_extentMajor">#</a> <i>graticule</i>.<b>extentMajor</b>([<i>extent</i>])

If *extent* is specified, sets the major extent of this graticule. If *extent* is not specified, returns the current major extent, which defaults to ⟨⟨-180°, -90° + ε⟩, ⟨180°, 90° - ε⟩⟩.

<a name="graticule_extentMinor" href="#graticule_extentMinor">#</a> <i>graticule</i>.<b>extentMinor</b>([<i>extent</i>])

If *extent* is specified, sets the minor extent of this graticule. If *extent* is not specified, returns the current minor extent, which defaults to ⟨⟨-180°, -80° - ε⟩, ⟨180°, 80° + ε⟩⟩.

<a name="graticule_step" href="#graticule_step">#</a> <i>graticule</i>.<b>step</b>([<i>step</i>])

If *step* is specified, sets the major and minor step for this graticule. If *step* is not specified, returns the current minor step, which defaults to ⟨10°, 10°⟩.

<a name="graticule_stepMajor" href="#graticule_stepMajor">#</a> <i>graticule</i>.<b>stepMajor</b>([<i>step</i>])

If *step* is specified, sets the major step for this graticule. If *step* is not specified, returns the current major step, which defaults to ⟨90°, 360°⟩.

<a name="graticule_stepMinor" href="#graticule_stepMinor">#</a> <i>graticule</i>.<b>stepMinor</b>([<i>step</i>])

If *step* is specified, sets the minor step for this graticule. If *step* is not specified, returns the current minor step, which defaults to ⟨10°, 10°⟩.

<a name="graticule_precision" href="#graticule_precision">#</a> <i>graticule</i>.<b>precision</b>([<i>angle</i>])

If *precision* is specified, sets the precision for this graticule, in degrees. If *precision* is not specified, returns the current precision, which defaults to 2.5°.

### Projections

<a href="#geoPath" name="geoPath">#</a> d3.<b>geoPath</b>()

…

<a href="_path" name="_path">#</a> <i>path</i>(<i>object</i>)

…

<a href="#path_area" name="path_area">#</a> <i>path</i>.<b>area</b>(<i>object</i>)

…

<a href="#path_bounds" name="path_bounds">#</a> <i>path</i>.<b>bounds</b>(<i>object</i>)

…

<a href="#path_centroid" name="path_centroid">#</a> <i>path</i>.<b>centroid</b>(<i>object</i>)

…

<a href="#path_projection" name="path_projection">#</a><i>path</i>.<b>projection</b>([<i>projection</i>])

…

<a href="#path_context" name="path_context">#</a><i>path</i>.<b>context</b>([<i>context</i>])

…

<a href="#path_pointRadius" name="path_pointRadius">#</a><i>path</i>.<b>pointRadius</b>([<i>radius</i>])

…

<a href="#geoProjection" name="geoProjection">#</a> d3.<b>geoProjection</b>(<i>project</i>)

…

<a href="#geoProjectionMutator" name="geoProjectionMutator">#</a> d3.<b>geoProjectionMutator</b>(<i>projectFactory</i>)

…

<a href="#_projection" name="_projection">#</a> <i>projection</i>(<i>point</i>)

…

<a href="#projection_invert" name="projection_invert">#</a> <i>projection</i>.<b>invert</b>(<i>point</i>)

…

<a href="#projection_stream" name="projection_stream">#</a> <i>projection</i>.<b>stream</b>(<i>stream</i>)

…

<a href="#projection_clipAngle" name="projection_clipAngle">#</a> <i>projection</i>.<b>clipAngle</b>([<i>angle</i>])

…

<a href="#projection_clipExtent" name="projection_clipExtent">#</a> <i>projection</i>.<b>clipExtent</b>([<i>extent</i>])

…

<a href="#projection_scale" name="projection_scale">#</a> <i>projection</i>.<b>scale</b>([<i>scale</i>])

…

<a href="#projection_translate" name="projection_translate">#</a> <i>projection</i>.<b>translate</b>([<i>translate</i>])

…

<a href="#projection_center" name="projection_center">#</a> <i>projection</i>.<b>center</b>([<i>center</i>])

…

<a href="#projection_rotate" name="projection_rotate">#</a> <i>projection</i>.<b>rotate</b>([<i>rotate</i>])

…

<a href="#projection_precision" name="projection_precision">#</a> <i>projection</i>.<b>precision</b>([<i>precision</i>])

…

<a href="#geoAlbers" name="geoAlbers">#</a> d3.<b>geoAlbers</b>()

<img src="https://raw.githubusercontent.com/d3/d3-geo/master/test/images/albers.png" width="480" height="250">

<a href="#geoAlbersUsa" name="geoAlbersUsa">#</a> d3.<b>geoAlbersUsa</b>()

<img src="https://raw.githubusercontent.com/d3/d3-geo/master/test/images/albersUsa.png" width="480" height="250">

<a href="#geoAzimuthalEqualArea" name="geoAzimuthalEqualArea">#</a> d3.<b>geoAzimuthalEqualArea</b>()

<img src="https://raw.githubusercontent.com/d3/d3-geo/master/test/images/azimuthalEqualArea.png" width="480" height="250">

<a href="#geoAzimuthalEquidistant" name="geoAzimuthalEquidistant">#</a> d3.<b>geoAzimuthalEquidistant</b>()

<img src="https://raw.githubusercontent.com/d3/d3-geo/master/test/images/azimuthalEquidistant.png" width="480" height="250">

<a href="#geoConicConformal" name="geoConicConformal">#</a> d3.<b>geoConicConformal</b>()

<img src="https://raw.githubusercontent.com/d3/d3-geo/master/test/images/conicConformal.png" width="480" height="250">

<a href="#geoConicEqualArea" name="geoConicEqualArea">#</a> d3.<b>geoConicEqualArea</b>()

<img src="https://raw.githubusercontent.com/d3/d3-geo/master/test/images/conicEqualArea.png" width="480" height="250">

<a href="#geoConicEquidistant" name="geoConicEquidistant">#</a> d3.<b>geoConicEquidistant</b>()

<img src="https://raw.githubusercontent.com/d3/d3-geo/master/test/images/conicEquidistant.png" width="480" height="250">

<a href="#geoEquirectangular" name="geoEquirectangular">#</a> d3.<b>geoEquirectangular</b>()

<img src="https://raw.githubusercontent.com/d3/d3-geo/master/test/images/equirectangular.png" width="480" height="250">

<a href="#geoGnomonic" name="geoGnomonic">#</a> d3.<b>geoGnomonic</b>()

<img src="https://raw.githubusercontent.com/d3/d3-geo/master/test/images/gnomonic.png" width="480" height="250">

<a href="#geoMercator" name="geoMercator">#</a> d3.<b>geoMercator</b>()

<img src="https://raw.githubusercontent.com/d3/d3-geo/master/test/images/mercator.png" width="480" height="250">

<a href="#geoOrthographic" name="geoOrthographic">#</a> d3.<b>geoOrthographic</b>()

<img src="https://raw.githubusercontent.com/d3/d3-geo/master/test/images/orthographic.png" width="480" height="250">

<a href="#geoStereographic" name="geoStereographic">#</a> d3.<b>geoStereographic</b>()

<img src="https://raw.githubusercontent.com/d3/d3-geo/master/test/images/stereographic.png" width="480" height="250">

<a href="#geoTransverseMercator" name="geoTransverseMercator">#</a> d3.<b>geoTransverseMercator</b>()

<img src="https://raw.githubusercontent.com/d3/d3-geo/master/test/images/transverseMercator.png" width="480" height="250">

### Streams

Yadda yadda some introduction about how D3 transforms geometry using sequences of function calls to minimize the overhead of intermediate representations…

Streams must implement several methods to receive input geometry. Streams are inherently stateful; the meaning of a [point](#point) depends on whether the point is inside of a [line](#lineStart), and likewise a line is distinguished from a ring by a [polygon](#polygonStart).

<a name="stream_point" href="#stream_point">#</a> <i>stream</i>.<b>point</b>(<i>x</i>, <i>y</i>[, <i>z</i>])

Indicates a point with the specified coordinates *x* and *y* (and optionally *z*). The coordinate system is unspecified and implementation-dependent; for example, [projection streams](https://github.com/d3/d3-geo-projection) require spherical coordinates in degrees as input. Outside the context of a polygon or line, a point indicates a point geometry object ([Point](http://www.geojson.org/geojson-spec.html#point) or [MultiPoint](http://www.geojson.org/geojson-spec.html#multipoint)). Within a line or polygon ring, the point indicates a control point.

<a name="stream_lineStart" href="#stream_lineStart">#</a> <i>stream</i>.<b>lineStart</b>()

Indicates the start of a line or ring. Within a polygon, indicates the start of a ring. The first ring of a polygon is the exterior ring, and is typically clockwise. Any subsequent rings indicate holes in the polygon, and are typically counterclockwise.

<a name="stream_lineEnd" href="#stream_lineEnd">#</a> <i>stream</i>.<b>lineEnd</b>()

Indicates the end of a line or ring. Within a polygon, indicates the end of a ring. Unlike GeoJSON, the redundant closing coordinate of a ring is *not* indicated via [point](#point), and instead is implied via lineEnd within a polygon. Thus, the given polygon input:

```json
{
  "type": "Polygon",
  "coordinates": [
    [[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]
  ]
}
```

Will produce the following series of method calls on the stream:

```js
stream.polygonStart();
stream.lineStart();
stream.point(0, 0);
stream.point(1, 0);
stream.point(1, 1);
stream.point(0, 1);
stream.lineEnd();
stream.polygonEnd();
```

<a name="stream_polygonStart" href="#stream_polygonStart">#</a> <i>stream</i>.<b>polygonStart</b>()

Indicates the start of a polygon. The first line of a polygon indicates the exterior ring, and any subsequent lines indicate interior holes.

<a name="stream_polygonEnd" href="#stream_polygonEnd">#</a> <i>stream</i>.<b>polygonEnd</b>()

Indicates the end of a polygon.

<a name="stream_sphere" href="#stream_sphere">#</a> <i>stream</i>.<b>sphere</b>()

Indicates the sphere (the globe; the unit sphere centered at ⟨0,0,0⟩).

<a href="#geoStream" name="geoStream">#</a> d3.<b>geoStream</b>(<i>object</i>, <i>stream</i>)

Streams the specified [GeoJSON](http://geojson.org) *object* to the specified *stream*. (Despite the name “stream”, these method calls are currently synchronous.) While both features and geometry objects are supported as input, the stream interface only describes the geometry, and thus additional feature properties are not visible to streams.

<a href="#geoTransform" name="geoTransform">#</a> d3.<b>geoTransform</b>(<i>prototype</i>)

Defines a simple transform projection, implementing [*projection*.stream](#projection_stream), using any methods defined on the specified *prototype*. Any undefined methods will use passthrough methods that propagate inputs to the output stream. For example, to invert the *y*-coordinates:

```js
var flipY = d3.geoTransform({
  point: function(x, y) {
    this.stream.point(x, -y);
  }
});
```

Or to define an affine matrix transformation:

```js
function matrix(a, b, c, d, tx, ty) {
  return d3.geoTransform({
    point: function(x, y) {
      this.stream.point(a * x + b * y + tx, c * x + d * y + ty);
    }
  });
}
```

### Tile

<a href="#geoTile" name="geoTile">#</a> d3.<b>geoTile</b>()

Constructs a layout for determining which 256x256 quadtree tiles to display in a rectangular viewport, based on a scale and translate. This layout can be used to create a simple slippy map, or render standard map tiles (e.g., MapBox, CloudMade) as a base layer behind a geographic projection.

```js
var tile = d3.geoTile();
```

<a href="#tile_size" name="tile_size">#</a> <i>tile</i>.<b>size</b>([<i>size</i>])

If *size* is specified, sets this tile layout’s size to the specified two-element array of numbers [*width*, *height*] and returns this tile layout. If *size* is not specified, returns the current layout size.

<a href="#tile_scale" name="tile_scale">#</a> <i>tile</i>.<b>scale</b>([<i>scale</i>])

If *scale* is specified, sets this tile layout’s scale to the specified number *scale* and returns this tile layout. If *scale* is not specified, returns the current layout scale.

<a href="#tile_translate" name="tile_translate">#</a> <i>tile</i>.<b>translate</b>([<i>translate</i>])

If *translate* is specified, sets this tile layout’s translate to the specified two-element array of numbers [*x*, *y*] and returns this tile layout. If *translate* is not specified, returns the current layout translate.

<a href="#tile_size" name="tile_size">#</a> <i>tile</i>()

Computes the set of 256x256 quadtree tiles to display given the current layout [size](#tile_size), [scale](#tile_scale) and [translate](#tile_translate). Returns an array of arrays that specify tile addresses as `[x, y, z]` where `z` is the zoom level.

For example, the address of a tile from OpenStreetMap can be computed as follows, where `d` is an entry in the returned array.

```js
"http://a.tile.openstreetmap.org/" + d[2] + "/" + d[0] + "/" + d[1] + ".png";
```

The returned array also has properties `scale` and `translate` that can be used to apply the correct transformation to a `<g>` element containing the tile images where tile images have unit width and height, and (x, y) coordinates corresponding to the tile address. For example usage, see [Raster & Vector 4.0](http://bl.ocks.org/curran/e857dbe6db49d4cac379855b0b6b58e9).
