export default function cssTransition(prop, duration, animation) {
  var style = '';  
  style += '-webkit-transition: -webkit-' + prop + ' ' + duration + 'ms ' + animation + '; ';
  style += '-moz-transition: -moz-' + prop + ' ' + duration + 'ms ' + animation + '; ';
  style += '-ms-transition: -ms-' + prop + ' ' + duration + 'ms ' + animation + '; ';
  style += '-o-transition: -o-' + prop + ' ' + duration + 'ms ' + animation + '; ';
  style += 'transition: ' + prop + ' ' + duration + 'ms ' + animation + '; ';
  return style;
}