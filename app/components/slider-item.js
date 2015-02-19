import Ember from 'ember';

export default Ember.Component.extend({
  classNameBindings: [':no-select', ':slider-item'],

  hammer: null,

  sliderHandle: null,
  sliderWidth: 0,

  rafPanId: null,
  rafSlideId: null,
  rafPercId: null,

  increment: null,
  percentage: 100,
  trackedPercentage: 0,

  startX: 0,
  startY: 0,
  startZ: 0,
  deltaX: null,

  _setup: function() {

    // define all elements
    this.sliderHandle = this.get('element').getElementsByClassName('handle')[0];
    this.sliderFill = this.get('element').getElementsByClassName('filler')[0];
    this.sliderWidth = this.get('element').getElementsByClassName('progress-bar')[0].offsetWidth;

    // get pixel-to-percentage ratio
    this.increment = 100 / this.sliderWidth;

    // set start percentage
    this.set('trackedPercentage', this.get('percentage'));

    // set start position
    this.lastX = this.get('percentage') / this.increment;
    this.animateHorizontalPan();

    // ini hammer bindings
    var hammer = new Hammer.Manager(this.get('element'));
      hammer.add(new Hammer.Pan({ enable: true, direction: Hammer.DIRECTION_HORIZONTAL, threshold: 10 }));

      hammer.on('panstart', this.panStart.bind(this));
      hammer.on('panmove', this.panMove.bind(this));
      hammer.on('panend', this.panEnd.bind(this));
    
      this.setProperties({
        hammer: hammer
      });

  }.on('didInsertElement'),

  _hammerTeardown: function () {
    var hammer = this.get('hammer');

    if (hammer) {
      hammer.destroy();
      this.set('hammer', null);
    }

  }.on('willDestroyElement'),

  panStart: function(event) {

    // set limits
    this.leftLimit = 0;
    this.rightLimit = this.sliderWidth;

    // set new start position
    this.startX = this.lastX;

    if (this.rafSlideId) {
      window.cancelAnimationFrame(this.rafSlideId);
      this.rafSlideId = null;
    }
    
  },

  trackPercentage: function() {
    this.rafPercId = null;

    var newPercentage = this.get('percentage') + (this.deltaX * this.increment);

    if (newPercentage > 100) { newPercentage = 100; }
    if (newPercentage < 0) { newPercentage = 0; }

    this.set('trackedPercentage', Math.round(newPercentage));

  },

  panMove: function(event) {

    this.deltaX = event.deltaX;

    if (!this.rafPercId) {
      this.rafPercId = window.requestAnimationFrame(this.trackPercentage.bind(this));
    }

    var newX = this.deltaX + this.startX; 

    if (newX < this.leftLimit) { newX = this.leftLimit; }
    if (newX > this.rightLimit) { newX = this.rightLimit; } 


    this.lastX = newX;

    if (!this.rafPanId) {
      this.rafPanId = window.requestAnimationFrame(this.animateHorizontalPan.bind(this));
    }
    
  },

  panEnd: function() {
    this.set('percentage', this.get('trackedPercentage'));
  },

  animateHorizontalPan: function() {
    this.rafPanId = null;

    var newX = this.lastX,
        style = '';

    style += '-webkit-transition: none; ';
    style += '-moz-transition: none; ';
    style += '-ms-transition: none; ';
    style += '-o-transition: none; ';
    style += 'transition: none; ';

    style += '-webkit-transform: translate3d(' + newX + 'px,' + this.startY + 'px,' + this.startZ + 'px) scale3d(1,1,1); ';
    style += '-moz-transform: translate3d(' + newX + 'px,' + this.startY + 'px,' + this.startZ + 'px); ';
    style += '-ms-transform: translate3d(' + newX + 'px,' + this.startY + 'px,' + this.startZ + 'px); ';
    style += '-o-transform: translate3d(' + newX + 'px,' + this.startY + 'px,' + this.startZ + 'px); ';
    style += 'transform: translate3d(' + newX + 'px,' + this.startY + 'px,' + this.startZ + 'px); ';

    this.sliderHandle.style.cssText = style;
    this.sliderFill.style.cssText = style;
  }

});
