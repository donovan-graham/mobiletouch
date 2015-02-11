import Ember from 'ember';
import PanElement from '../mixins/pan-element';

export default Ember.Component.extend(PanElement, {
  classNames: ['side-menu', 'no-select'],

  elementId: 'app-side-menu',

  width: 240, // pixels
  duration: 240, // milli-seconds

  actions: {
    toggleMenu: function() {
      this.toggleProperty('panOpen');
    },
  }

});