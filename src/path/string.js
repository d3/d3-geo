// Simple caching for constant-radius points.
let cacheDigits, cacheTemplate, cacheRadius, cacheCircle;

export default class PathString {
  constructor(digits) {
    this._template = digits == null ? template : templateFixed(digits = +digits);
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
        this._ += this._template`M${x},${y}`;
        this._point = 1;
        break;
      }
      case 1: {
        this._ += this._template`L${x},${y}`;
        break;
      }
      default: {
        this._ += this._template`M${x},${y}`;
        if (this._template !== cacheTemplate || this._radius !== cacheRadius) {
          const r = cacheRadius = this._radius;
          cacheTemplate = this._template;
          cacheCircle = this._template`m0,${r}a${r},${r} 0 1,1 0,${-2 * r}a${r},${r} 0 1,1 0,${2 * r}z`;
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

function template(strings) {
  let i = 1, string = strings[0];
  for (const j = strings.length; i < j; ++i) {
    string += arguments[i] + strings[i];
  }
  return string;
}

function templateFixed(digits) {
  if (digits !== cacheDigits) {
    (0).toFixed(digits); // validate digits
    cacheDigits = digits;
    cacheTemplate = function template(strings) {
      let i = 1, string = strings[0];
      for (const j = strings.length; i < j; ++i) {
        string += +arguments[i].toFixed(digits) + strings[i];
      }
      return string;
    };
  }
  return cacheTemplate;
}
