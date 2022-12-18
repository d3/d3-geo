// Simple caching for constant-radius points.
let cacheDigits, cacheAppend, cacheRadius, cacheCircle;

export default class PathString {
  constructor(digits) {
    this._append = digits == null ? append : appendFixed(+digits);
    this._radius = 4.5;
    this._ = "";
  }
  pointRadius(_) {
    this._radius = +_;
    return this;
  }
  polygonStart() {
    this._line = 0;
  }
  polygonEnd() {
    this._line = NaN;
  }
  lineStart() {
    this._point = 0;
  }
  lineEnd() {
    if (this._line === 0) this._ += "Z";
    this._point = NaN;
  }
  point(x, y) {
    switch (this._point) {
      case 0: {
        this._append`M${x},${y}`;
        this._point = 1;
        break;
      }
      case 1: {
        this._append`L${x},${y}`;
        break;
      }
      default: {
        this._append`M${x},${y}`;
        if (this._append !== cacheAppend || this._radius !== cacheRadius) {
          const r = cacheRadius = this._radius;
          const p = new PathString(this._digits);
          p._append`m0,${r}a${r},${r} 0 1,1 0,${-2 * r}a${r},${r} 0 1,1 0,${2 * r}z`;
          cacheAppend = this._append;
          cacheCircle = p._;
        }
        this._ += cacheCircle;
        break;
      }
    }
  }
  result() {
    const result = this._;
    this._ = "";
    return result.length ? result : null;
  }
}

function append(strings) {
  let i = 1;
  this._ += strings[0];
  for (const j = strings.length; i < j; ++i) {
    this._ += arguments[i] + strings[i];
  }
}

function appendFixed(digits) {
  if (digits !== cacheDigits) {
    (0).toFixed(digits); // validate digits
    cacheDigits = digits;
    cacheAppend = function append(strings) {
      let i = 1;
      this._ += strings[0];
      for (const j = strings.length; i < j; ++i) {
        this._ += +arguments[i].toFixed(digits) + strings[i];
      }
    };
  }
  return cacheAppend;
}
