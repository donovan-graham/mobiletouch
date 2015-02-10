import Ember from 'ember';

export default Ember.Component.extend({
  isActive: false,
  rafId: null,

  observeIsActive: function() {
    if (!this.rafId) {
      this.rafId = window.requestAnimationFrame(this.animateOverlay.bind(this));
    }  
  }.observes('isActive'), 

  animateOverlay: function () {
    this.rafId = null;

    if (this.get('isActive')) {
      this.get('element').classList.add('active');
    } else {
      this.get('element').classList.remove('active');      
    }
  }

});
