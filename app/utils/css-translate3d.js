export default function cssTranslate3D(x,y,z) {
  var style = '';
  style += '-webkit-transform: translate3d(' + x + 'px, ' + y + 'px, ' + z + 'px) scale3d(1,1,1); ';
  style += '-moz-transform: translate3d(' + x + 'px, ' + y + 'px, ' + z + 'px); ';
  style += '-ms-transform: translate3d(' + x + 'px, ' + y + 'px, ' + z + 'px); ';
  style += '-o-transform: translate3d(' + x + 'px, ' + y + 'px, ' + z + 'px); ';
  style += 'transform: translate3d(' + x + 'px, ' + y + 'px, ' + z + 'px); ';
  return style;
};