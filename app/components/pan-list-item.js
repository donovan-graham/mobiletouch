import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['list-item-content'],

  revealWidth: 200, 
  lastDeltaX: 0,

  isOpen: false,


  setup: function() {
    this.get('revealClip');
    this.get('startDelatX');
  }.on('init'),


  startX: function() {
    return this.get('isOpen') ? -1 * this.get('revealWidth') : 0; 
  }.property('isOpen', 'revealWidth'),

  revealClip: function() {
    return Math.round((this.get('revealWidth') / 2),0);  
  }.property('revealWidth'),

  panLeft: function(ev) {
    var deltaX = this.get('startX') + ev.originalEvent.gesture.deltaX;
    console.log("panLeft:", deltaX, ', element:', this.get('elementId'));
    this.animateHorizontalPan(deltaX);
  },

  panRight: function(ev) {
    var deltaX = this.get('startX') + ev.originalEvent.gesture.deltaX;
    console.log("panRight:", deltaX, ', element:', this.get('elementId'));
    this.animateHorizontalPan(deltaX);
  },

  panEnd: function(ev) {
    console.log('panEnd', ', element:', this.get('elementId'));

    if (Math.abs(this.get('lastDeltaX')) <= this.get('revealClip')) {
      this.set('isOpen', false);
    } else {
      this.set('isOpen', true);
    }

    this.animateHorizontalSlide();
  },


  animateHorizontalPan: function(deltaX) {
    deltaX = Math.min(Math.max(deltaX, -1 * this.get('revealWidth')), 0);
    this.set('lastDeltaX', deltaX);

    var style = [];

    style.push('-webkit-transition: none');
    style.push('-moz-transition: none');
    style.push('-ms-transition: none');
    style.push('-o-transition: none');
    style.push('transition: none');

    style.push('-webkit-transform: translate3d(' + deltaX + 'px,0px,0px) scale3d(1,1,1)');
    style.push('-moz-transform: translate3d(' + deltaX + 'px,0px,0px)');
    style.push('-ms-transform: translate3d(' + deltaX + 'px,0px,0px)');
    style.push('-o-transform: translate3d(' + deltaX + 'px,0px,0px)');
    style.push('transform: translate3d(' + deltaX + 'px,0px,0px)');

    this.$().attr("style", style.join("; "));

  },


  animateHorizontalSlide: function(deltaX) {

    var x = this.get('startX'),
        style = [],
        speed = 100,
        animation = 'ease';

    
    style.push('-webkit-transition: -webkit-transform '+ speed +'ms '+ animation);
    style.push('-moz-transition: -moz-transform '+ speed +'ms '+ animation);
    style.push('-ms-transition: -ms-transform '+ speed +'ms '+ animation);
    style.push('-o-transition: -o-transform '+ speed +'ms '+ animation);
    style.push('transition: transform '+ speed +'ms '+ animation);

    style.push('-webkit-transform: translate3d(' + x + 'px,0px,0px) scale3d(1,1,1)');
    style.push('-moz-transform: translate3d(' + x + 'px,0px,0px)');
    style.push('-ms-transform: translate3d(' + x + 'px,0px,0px)');
    style.push('-o-transform: translate3d(' + x + 'px,0px,0px)');
    style.push('transform: translate3d(' + x + 'px,0px,0px)');

    this.$().attr("style", style.join("; "));

    if (!this.get('isOpen')) {

      Ember.run.later(this, function() {
        this.$().attr("style", "");
      }, speed + 1);

    } else {

      Ember.run.later(this, function() {

        var style = [];

        style.push('-webkit-transition: none');
        style.push('-moz-transition: none');
        style.push('-ms-transition: none');
        style.push('-o-transition: none');
        style.push('transition: none');

        var currentStyle = this.$()[0].style;
        style.push('-webkit-transform: ' + currentStyle.webkitTransform || 'translate3d(0px,0px,0px) scale3d(1,1,1)');
        style.push('-moz-transform: ' + currentStyle.mozTransform || 'translate3d(0px,0px,0px)');
        style.push('-ms-transform: ' + currentStyle.msTransform || 'translate3d(0px,0px,0px)');
        style.push('-o-transform: ' + currentStyle.oTransform || 'translate3d(0px,0px,0px)');
        style.push('transform: ' + currentStyle.transform || 'translate3d(0px,0px,0px)');
        
        this.$().attr("style", style.join("; "));

      }, speed + 1);
    }
  }




});
