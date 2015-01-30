import Ember from 'ember';
import PanElement from '../mixins/pan-element';

export default Ember.Component.extend(PanElement, {
  classNames: ['side-menu', 'no-select'],
  //classNameBindings: ['isPanOpen:open'],

  elementId: 'app-side-menu',

  width: 240, // pixels
  duration: 240, // milli-seconds

  panElementId: null,
  panElementByName: null,
  panElementTagName: null,
  panElementCssSelector: null,

  actions: {
    toggleMenu: function() {
      console.log('toggleMenu');
    }
  }

});