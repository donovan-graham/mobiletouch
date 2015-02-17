import Ember from 'ember';

export default Ember.Component.extend({
  classNameBindings: [':no-select', ':slider-item'],

  isSliding: false,

  hammer: null,

  sliderContainer: null,
  sliderHandle: null,
  sliderWidth: 0,

  rafPanId: null,
  rafSlideId: null,

  _setup: function() {

    this.sliderContainer = this.get('element');
    this.sliderHandle = this.get('element').childNodes[1].childNodes[1].childNodes[1]; // specificity for speed
    this.sliderWidth = this.get('element').childNodes[1].offsetWidth;

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

    this.set('isSliding', true);
    console.log('>>>> panStart');

    var style = window.getComputedStyle(this.sliderHandle);  // Need the DOM object
    var matrix = new WebKitCSSMatrix(style.webkitTransform);
    this.startX = matrix.m41;
    this.startY = matrix.m42;
    this.startZ = matrix.m43;

    this.leftLimit = (this.startX + this.sliderWidth) * -1;
    this.rightLimit = this.sliderWidth - (this.startX + this.sliderWidth);

    if (this.rafSlideId) {
      window.cancelAnimationFrame(this.rafSlideId);
      this.rafSlideId = null;
    }
    
  },

  panMove: function(event) {

      var newX = event.deltaX + this.startX; 

      if (event.deltaX < this.leftLimit){ 
        this.lastX = this.sliderWidth * -1;
        if (!this.rafPanId) {
          this.rafPanId = window.requestAnimationFrame(this.animateHorizontalPan.bind(this));
        }
        return;
      }
      if (event.deltaX > this.rightLimit){ 
        this.lastX = 0;
        if (!this.rafPanId) {
          this.rafPanId = window.requestAnimationFrame(this.animateHorizontalPan.bind(this));
        }
        return; 
      }

      this.lastX = newX;

      if (!this.rafPanId) {
        this.rafPanId = window.requestAnimationFrame(this.animateHorizontalPan.bind(this));
      }
    
  },

  panEnd: function() {
    console.log('>>>> panEnd');
    this.set('isSliding', false);
  },

  animateHorizontalPan: function() {
    this.rafPanId = null;      // release the lock

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
  }

});
