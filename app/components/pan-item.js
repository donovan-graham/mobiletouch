import Ember from 'ember';
import PanElement from '../mixins/pan-element';

export default Ember.Component.extend(PanElement, {
  classNames: ['list-item-content', 'no-select'],
  //classNameBindings: ['isPanOpen:open'],

  // width: 200, // pixels
  // duration: 200, // milli-seconds

});
