
//
// Rect
//

var Rect = {
  defaults: {
    stroke: "#777777",
    "stroke-width": 5,
    "stroke-opacity": 0.4, 
    fill: "#ffffff",
    "fill-opacity": 0.0
  }
};

Rect.new = function(props) {

  var r = {};
  for (prop in Rect.defaults) {
    r[prop] = Rect.defaults[prop];
  }
  for (prop in props) {
    r[prop] = props[prop];
  }

  r.print = function() {
    return JSON.stringify(r);
  };

  r.el = function() {
    var el = document.createElementNS('http://www.w3.org/2000/svg', "rect");
    ["x", "y", "height", "width", "stroke", "stroke-opacity", "stroke-width" , "fill", "fill-opacity"].forEach(function(attr) {
      if (r[attr]) {
        el.setAttribute(attr, r[attr]);
      }
    });
    return el; 
  };

  r.calcBoundary = function() {
    r.boundary = {
      x: r.x - r.width*(1-r.space)/2,
      y: r.y - r.height*(1-r.space)/2,
      width: r.width*(2-r.space),
      height: r.height*(2-r.space)
    };
    return r.boundary;
  };

  r.calcCore = function() {
    r.core = {
      x: r.x + r.width*(1-r.space)/2,
      y: r.y + r.height*(1-r.space)/2,
      width: r.space * r.width,
      height: r.space * r.height
    };
    return r.core;
  };

  r.overlapTest = function(c) {
    var b = r.boundary || r.calcBoundary();
    if ( ( (c.x > b.x + b.width) || (c.y > r.y + r.height) ) || ( (c.x + c.width < b.x) || (c.y + c.height < b.y) ) ) {
      return false;
    }
    return true;
  };

  r.coreTest = function(c) {
    var core = r.core || r.calcCore();
    var cornersInCore = 0;
    [
      [c.x, c.y],
      [c.x, c.y + c.height],
      [c.x + c.width, c.y],
      [c.x + c.width, c.y + c.height]
    ].forEach(function(point) {
      if ( (point[0] > r.core.x && point[0] < (r.core.x + r.core.width) ) && (point[1] > r.core.y && point[1] < (r.core.y + r.core.height) ) ) {
        cornersInCore += 1;
        if (cornersInCore > 1) {
          return false;
        }
      }
    });
    if (cornersInCore < 1) {
      return false;
    }
    return true;
  }

  r.accept = function(candidate) {
    return !r.overlapTest(candidate) || r.coreTest(candidate);
  };

  return r;

};


//
// Utilities
//

var randomOnSegments = function(segs) {
  var l = 0;
  segs.forEach(function(seg) {
    l += (seg[1] - seg[0]);
  });
  var r = Math.floor(Math.random() * l);
  var a;
  var i = 0;
  while (!a) {
    seg = segs[i];
    if (seg[0] + r <= seg[1]) {
      a = seg[0] + r;
    }
    r = r - (seg[1] - seg[0]);
    i+=1;
  }
  return a;
};


//
//  Set
//

var Set = {};

Set.new = function(props) {

  var set = {
    Rect: props.Rect,
    el: props.el,
    margin: props.margin || 0,
    height: props.height - 2 * (props.margin || 0),
    width: props.width - 2 * (props.margin || 0),
    hmin: props.hmin || 40,
    hmax: props.hmax || 100,
    wmin: props.wmin || 50,
    wmax: props.wmax || 200,
    space: props.space || 0.3,
    gapmin: props.gapmin || 30,
    gapmax: props.gapmax || 60
  };

  set.rects = [];

  set.add = function() {
    var c = set.random();
    //
    // validate rect
    //
    for (var i=0; i<set.rects.length; i++) {
      var r = set.rects[i];
      if (!r.accept(c)) {
        console.log("rejecting rect: " + c.print() + "\n conflicts with: " + r.print() );
        return null;
      }
    }
    console.log("adding rect: " + c.print());
    set.rects.push(c);
    set.el.appendChild(c.el());
    return c;
  };

  set.random = function() {
    var x = randomOnSegments([[0, set.width - set.wmin]]);
    var y = randomOnSegments([[0, set.height - set.hmin]]);
    var width = randomOnSegments([[set.wmin, Math.min(set.wmax, set.width - x)]]);
    var height = randomOnSegments([[set.hmin, Math.min(set.hmax, set.height - y)]]);
    var r = Rect.new({
      x: x,
      y: y,
      width: width,
      height: height
    });
    return r;
  };

  return set;

};



//
// main
//


var main = function() {
  var svg = document.getElementById("svg");
  var c = document.getElementById("c");
  var s = Set.new({
    Rect: Rect,
    el: c,
    margin: 10,
    height: svg.getAttribute("height"),
    width: svg.getAttribute("width")
  });
  o = {
    s: s
  };
  for (var i=0; i<5; i++) {
    o.s.add();
  }
};


document.addEventListener('DOMContentLoaded', function() {
  main();
});
