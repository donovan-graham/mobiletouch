import cssTransition from '../utils/css-transition';

export default function cssTransitionTransform(duration, animation) {
  return cssTransition('transform', duration, animation);
}