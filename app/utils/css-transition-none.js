export default function cssTransitionNone() {
  var style = '';  
  style += '-webkit-transition: " "; ';
  style += '-moz-transition: " "; ';
  style += '-ms-transition: " "; ';
  style += '-o-transition: " "; ';
  style += 'transition: " "; ';
  return style;
}