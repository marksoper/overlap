

var Rect = {
  hmax: 100,
  wmax: 200,
  smin: 10
};

Rect.new = function(props) {

  var r = {};
  for (prop in props) {
    r[prop] = props[prop];
  }
  if (r.height && r.width) {
    r.ox = r.x + r.width;
    r.oy = r.y + r.height;
  } else {
    r.height = r.height || (r.oy - r.y);
    r.width = r.width || (r.ox - r.x);
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

var r = Rect.new({
  x: 0,
  y: 0,
  height: 100,
  width: 200,
  stroke: "#777777",
  "stroke-width": 5,
  "stroke-opacity": 0.8, 
  fill: "#ffffff",
  "fill-opacity": 0.0
});


document.addEventListener('DOMContentLoaded', function() {
  var c = document.getElementById("c");
  c.appendChild(r.el());
});
