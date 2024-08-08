function hexToRgb(hex) {
  let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
  });

  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
  } : null;
}



function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
      h = s = 0;
  } else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
  }

  return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
  };
}

function hslToRgb(h, s, l) {
  let r, g, b;
  h /= 360;
  s /= 100;
  l /= 100;

  if (s === 0) {
      r = g = b = l;
  } else {
      let hue2rgb = function(p, q, t) {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1 / 6) return p + (q - p) * 6 * t;
          if (t < 1 / 3) return q;
          if (t < 1 / 2) return p + (q - p) * (2 / 3 - t) * 6;
          return p;
      };

      let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      let p = 2 * l - q;

      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
  };
}

function rgbToCmyk(r, g, b) {
  let c = 1 - (r / 255);
  let m = 1 - (g / 255);
  let y = 1 - (b / 255);
  let k = Math.min(c, m, y);
  c = (c - k) / (1 - k);
  m = (m - k) / (1 - k);
  y = (y - k) / (1 - k);
  return {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100)
  };
}

function cmykToRgb(c, m, y, k) {
  let r = 255 * (1 - c) * (1 - k);
  let g = 255 * (1 - m) * (1 - k);
  let b = 255 * (1 - y) * (1 - k);
  return {
      r: Math.round(r),
      g: Math.round(g),
      b: Math.round(b)
  };
}

function rgbToHsv(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, v = max;
  let d = max - min;
  s = max === 0 ? 0 : d / max;
  if (max === min) {
      h = 0;
  } else {
      switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
  }
  return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      v: Math.round(v * 100)
  };
}

function hsvToRgb(h, s, v) {
  let r, g, b;
  h /= 360;
  s /= 100;
  v /= 100;
  let i = Math.floor(h * 6);
  let f = h * 6 - i;
  let p = v * (1 - s);
  let q = v * (1 - f * s);
  let t = v * (1 - (1 - f) * s);
  switch (i % 6) {
      case 0: r = v, g = t, b = p; break;
      case 1: r = q, g = v, b = p; break;
      case 2: r = p, g = v, b = t; break;
      case 3: r = p, g = q, b = v; break;
      case 4: r = t, g = p, b = v; break;
      case 5: r = v, g = p, b = q; break;
  }
  return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
  };
}

function convertColors() {
  let inputColor = document.getElementById('inputColor').value;
  let inputFormat = document.getElementById('inputFormat').value;
  let outputFormat = document.getElementById('outputFormat').value;
  let result = document.getElementById('result');
  let colorDisplay = document.getElementById('colorDisplay');
  let rgb, hex, hsl, cmyk, hsv;

  if (inputFormat === 'hex') {
      rgb = hexToRgb(inputColor);
  } else if (inputFormat === 'rgb') {
      let rgbValues = inputColor.match(/\d+/g);
      rgb = {
          r: parseInt(rgbValues[0]),
          g: parseInt(rgbValues[1]),
          b: parseInt(rgbValues[2])
      };
  } else if (inputFormat === 'hsl') {
      let hslValues = inputColor.match(/\d+/g);
      rgb = hslToRgb(parseInt(hslValues[0]), parseInt(hslValues[1]), parseInt(hslValues[2]));
  } else if (inputFormat === 'cmyk') {
      let cmykValues = inputColor.match(/\d+/g);
      rgb = cmykToRgb(parseInt(cmykValues[0]), parseInt(cmykValues[1]), parseInt(cmykValues[2]), parseInt(cmykValues[3]));
  } else if (inputFormat === 'hsv') {
      let hsvValues = inputColor.match(/\d+/g);
      rgb = hsvToRgb(parseInt(hsvValues[0]), parseInt(hsvValues[1]), parseInt(hsvValues[2]));
  } else {
      result.innerHTML = 'Invalid input format.';
      return;
  }

  if (!rgb) {
      result.innerHTML = 'Invalid input color.';
      return;
  }

  hex = rgbToHex(rgb.r, rgb.g, rgb.b);
  hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
  hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);

  colorDisplay.style.backgroundColor = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  colorDisplay.classList.add('show');

  switch (outputFormat) {
      case 'hex':
          result.innerHTML = `HEX: ${hex}`;
          break;
      case 'rgb':
          result.innerHTML = `RGB: (${rgb.r}, ${rgb.g}, ${rgb.b})`;
          break;
      case 'hsl':
          result.innerHTML = `HSL: (${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
          break;
      case 'cmyk':
          result.innerHTML = `CMYK: (${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;
          break;
      case 'hsv':
          result.innerHTML = `HSV: (${hsv.h}, ${hsv.s}%, ${hsv.v}%)`;
          break;
      default:
          result.innerHTML = 'Invalid output format.';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('inputFormat').value = 'hex';
  document.getElementById('outputFormat').value = 'rgb';
});
