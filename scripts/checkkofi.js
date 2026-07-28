//kc
function b(c, d) {
  var e = a();
  return (
    (b = function (f, g) {
      f = f - 0x175;
      var h = e[f];
      if (b["lZofUB"] === undefined) {
        var i = function (m) {
          var n =
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=";
          var o = "",
            p = "";
          for (
            var q = 0x0, r, s, t = 0x0;
            (s = m["charAt"](t++));
            ~s && ((r = q % 0x4 ? r * 0x40 + s : s), q++ % 0x4)
              ? (o += String["fromCharCode"](0xff & (r >> ((-0x2 * q) & 0x6))))
              : 0x0
          ) {
            s = n["indexOf"](s);
          }
          for (var u = 0x0, v = o["length"]; u < v; u++) {
            p +=
              "%" +
              ("00" + o["charCodeAt"](u)["toString"](0x10))["slice"](-0x2);
          }
          return decodeURIComponent(p);
        };
        ((b["hfkodr"] = i), (c = arguments), (b["lZofUB"] = !![]));
      }
      var j = e[0x0],
        k = f + j,
        l = c[k];
      return (!l ? ((h = b["hfkodr"](h)), (c[k] = h)) : (h = l), h);
    }),
    b(c, d)
  );
}
function a() {
  var l = [
    "mtqZnMTtExD3tW",
    "mta3nJe5nJbntNP1r3q",
    "mtq2nZvzwwDjuLe",
    "AwrVBMf0zwr0B3rOzwTVzMLWAw5LyxbWBgu",
    "mJfkwxzTywW",
    "offZuhzRDG",
    "mZy1nJiWnufJvfndCW",
    "ndi2mda1muTOs0r6vG",
    "mtC4mJy3mLbzt2X2Bq",
    "mte3ndK4CKPMALrV",
    "mZm4mZq2CuLVqvne",
  ];
  a = function () {
    return l;
  };
  return a();
}
(function (c, d) {
  var h = b,
    e = c();
  while (!![]) {
    try {
      var f =
        -parseInt(h(0x178)) / 0x1 +
        (parseInt(h(0x179)) / 0x2) * (parseInt(h(0x17e)) / 0x3) +
        (-parseInt(h(0x17a)) / 0x4) * (parseInt(h(0x17c)) / 0x5) +
        -parseInt(h(0x177)) / 0x6 +
        parseInt(h(0x175)) / 0x7 +
        (parseInt(h(0x17f)) / 0x8) * (-parseInt(h(0x176)) / 0x9) +
        parseInt(h(0x17b)) / 0xa;
      if (f === d) break;
      else e["push"](e["shift"]());
    } catch (g) {
      e["push"](e["shift"]());
    }
  }
})(a, 0xcd594);
export function checkKofi(c) {
  var i = b;
  return c === i(0x17d);
}
