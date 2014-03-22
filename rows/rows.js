
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
  if (r.height && r.width) {
    r.dx = r.x + r.width;
    r.dy = r.y + r.height;
  } else {
    r.height = r.height || (r.dy - r.y);
    r.width = r.width || (r.dx - r.x);
  }

  r.el = function() {
    var el = document.createElementNS('http://www.w3.org/2000/svg', "rect");
    ["x", "y", "height", "width", "stroke", "stroke-opacity", "stroke-width" , "fill", "fill-opacity"].forEach(function(attr) {
      if (r[attr]) {
        el.setAttribute(attr, r[attr]);
      }
    });
    return el; 
  };

  return r;

};



//
// Overlap
//

var Overlap = {};

Overlap.new = function(props) {

  var o = {
    Rect: props.Rect,
    el: props.el,
    margin: props.margin || 0,
    height: props.height - 2 * (props.margin || 0),
    width: props.width - 2 * (props.margin || 0),
    hmin: props.hmin || 40,
    hmax: props.hmax || 100,
    wmin: props.wmin || 50,
    wmax: props.wmax || 200,
    space: props.space || 32,
    gapmin: props.gapmin || 30,
    gapmax: props.gapmax || 60
  };

  o.colors = {
    0: "black",
    1: "red",
    2: "blue",
    3: "green",
    4: "yellow",
    5: "pink"
  };

  o.build = function() {
    o.rects = [];
    o.y = 0 + o.margin;
    var shade;
    while (o.y < o.height) {
      if (o.rects.length > 0) {
        o.y = o.rects[o.rects.length - 1][0].dy
      }
      shade = Math.min(255, Math.floor(256 * o.rects.length / 8));
      console.log("building row " + o.rects.length);
      o.rects.push(o.buildRow({
        stroke: o.colors[o.rects.length]
      }));
    }
  };

  o.buildRow = function(props) {
    props = props || {};
    var rects = [];
    o.x = 0 + o.margin;
    while (o.x < o.width) {

      if (o.ly) {
        var segs = [];
        [
          [o.y + o.hmin, o.y + o.ly - o.space],
          [o.y + o.ly + o.space, o.y + o.hmax]
        ].forEach(function(seg) {
          if (seg[1] - seg[0] >= 1) {
            segs.push(seg);
          }
        });

        if (segs.length === 0) {
          console.log(" no seg ");
          o.dx = o.x + o.gapmin + Math.floor(Math.random() * (o.gapmax - o.gapmin));
          o.x = o.dx;
          o.ly = 0;
          continue;
        }

        o.dy = o.randomOnSegments(segs);
      } else {
        o.dy = o.y + Math.floor(o.hmin + Math.random() * (o.hmax - o.hmin));
      }
      //
      // Note problem here with last rect in row potentially being smaller than wmin
      //
      o.dx = Math.min(o.width, o.x + Math.floor(o.wmin + Math.random() * (o.wmax - o.wmin)));
      //
      //
      //
      props.x = o.x;
      props.y = o.y;
      props.dx = o.dx;
      props.dy = o.dy;
      //
      var r = Rect.new(props);
      rects.push(r);

      //console.log("drawing rect with x: " + [o.x, o.y, o.dx, o.dy].join(" , "));

      o.drawRect(r);
      //
      o.x = o.dx;
      o.ly = o.dy;
    }

    return rects;

  };

  o.drawRect = function(r) {
    o.el.appendChild(r.el());
  };

  o.randomOnSegments = function(segs) {
    var l = 0;
    segs.forEach(function(seg) {
      l += (seg[1] - seg[0]);
    });
    var r = Math.floor(Math.random() * l);
    var x;
    var i = 0;
    while (!x) {
      seg = segs[i];
      if (seg[0] + r <= seg[1]) {
        x = seg[0] + r;
      }
      r = r - (seg[1] - seg[0]);
      i+=1;
    }
    return x;
  };

  return o;

};

var r = Rect.new({
  x: 10,
  y: 10,
  height: 100,
  width: 200
});

var main = function() {
  var svg = document.getElementById("svg");
  var c = document.getElementById("c");
  var o = Overlap.new({
    Rect: Rect,
    el: c,
    margin: 10,
    height: svg.getAttribute("height"),
    width: svg.getAttribute("width")
  });
  o.build();
};


document.addEventListener('DOMContentLoaded', function() {
  main();
});
