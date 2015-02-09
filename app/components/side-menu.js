import Ember from 'ember';
import PanElement from '../mixins/pan-element';

export default Ember.Component.extend(PanElement, {
  classNames: ['side-menu', 'no-select'],
  //classNameBindings: ['isPanOpen:open'],

  elementId: 'app-side-menu',

  width: 240, // pixels
  duration: 240, // milli-seconds

  overlayElement: null,

  panElementId: null,
  panElementByName: null,
  panElementTagName: null,
  panElementCssSelector: null,

  _setup: function() {
    this.overlayElement = document.getElementById('overlay');
  }.on('didInsertElement'),

  _teardown: function() {
    this.overlayElement = null;
  }.on('willDestroyElement'),



  actions: {
    toggleMenu: function() {
      console.log('toggleMenu');

      this.toggleProperty('panOpen');

      if (this.rafPanId) {
        window.cancelAnimationFrame(this.rafPanId);
        this.rafPanId = null;
      }

      if (!this.rafSlideId) {
        this.rafSlideId = window.requestAnimationFrame(this.animateHorizontalSlide.bind(this));
      }
    }
  }

});