import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['list-item-content'],

  revealWidth: 200, 
  lastX: 0,
  startX: null,

  isOpen: false,
  hammer: null, 


  _setupCoordinates: function() {
    this.get('revealClip');
    this.get('startDelatX');
  }.on('init'),

  _setupHammer: function() {

    var _this = this,
        hammer = new Hammer(_this.get('element'));

    hammer.get('pan').set({
      direction: Hammer.DIRECTION_HORIZONTAL,
      threshold: 10
    });
    
    var self = this;
    
    hammer.on('panleft', function (ev) {
      var output = self.panLeft.apply(self, Array.prototype.slice.call(arguments));
      if (output === false) {
        if (typeof event.stopPropagation !== 'undefined') {
          event.stopPropagation();
        } else {
          event.srcEvent.stopPropagation();
        }
      }
      return output;
    });


    
    hammer.on('panright', function (ev) {
      var output = self.panRight.apply(self, Array.prototype.slice.call(arguments));
      if (output === false) {
        if (typeof event.stopPropagation !== 'undefined') {
          event.stopPropagation();
        } else {
          event.srcEvent.stopPropagation();
        }
      }
      return output;
    });


    hammer.on('panend', function (ev) {
      var output = self.panEnd.apply(self, Array.prototype.slice.call(arguments));
      if (output === false) {
        if (typeof event.stopPropagation !== 'undefined') {
          event.stopPropagation();
        } else {
          event.srcEvent.stopPropagation();
        }
      }
      return output;
    });


    // hammer.on('tap', _this.tapped);
    // hammer.on('panstart', _this.panStart);
    // hammer.on('panleft', _this.panLeft);
    // hammer.on('panright', _this.panRight);
    // hammer.on('panend', _this.panEnd);
    
    this.set('hammer', hammer);

  }.on('willInsertElement'),

  _teardownHammer: function () {
    var hammer = this.get('hammer');

    if (hammer) {
      hammer.destroy();
    }

    this.set('hammer', null);
    // PreventGhostClicks.remove(element);
  }.on('willDestroyElement'),


  // startX: function() {
  //   return this.get('isOpen') ? -1 * this.get('revealWidth') : 0; 
  // }.property('isOpen', 'revealWidth'),

  revealClip: function() {
    return Math.round((this.get('revealWidth') / 2),0);  
  }.property('revealWidth'),


  panLeft: function(ev) {

    if (this.startX === null || this.startX === undefined) { 
      this.startX = this.$().position().left; 
    }

    // console.log("panLeft:", ev.deltaX, " startX:", this.startX);
    this.animateHorizontalPan(this.startX + ev.deltaX);
  },

  panRight: function(ev) {
    if (this.startX === null || this.startX === undefined) { 
      this.startX = this.$().position().left; 
    }

    // console.log("panRight:", ev.deltaX, " el:", this.get('startX'));
    this.animateHorizontalPan(this.startX + ev.deltaX);
  },

  panEnd: function(ev) {

    var absX = Math.abs(this.lastX);

    if (absX === this.get('revealWidth') || absX === 0) { return; }

    if (absX >= this.get('revealClip')) {
      this.animateHorizontalSlide(-1 * this.get('revealWidth'));
    } else {
      this.animateHorizontalSlide(0);
    }

    this.startX = null; 
  },


  animateHorizontalPan: function(xPos) {
    xPos = Math.min(Math.max(xPos, -1 * this.get('revealWidth')), 0);

    this.lastX = xPos;

    var style = [];

    var transition = '-webkit-transition: %@; -moz-transition: %@; -ms-transition: %@; -o-transition: %@; transition: %@;',
        transform =  '-webkit-transform: translate3d(%@px,0px,0px) scale3d(1,1,1); -moz-transform: translate3d(%@px,0px,0px); -ms-transform: translate3d(%@px,0px,0px); -o-transform: translate3d(%@px,0px,0px); transform: translate3d(%@px,0px,0px);';

    this.$().attr("style", [transition.fmt('none'), transform.fmt(xPos)].join(" "));

  },


  animateHorizontalSlide: function(xPos) {

    var speed = 100,
        animation = 'ease',
        transition = '-webkit-transition: -webkit-transform %@; -moz-transition: -moz-transform %@; -ms-transition: -ms-transform %@; -o-transition: -o-transform %@; transition: transform %@;',
        transform =  '-webkit-transform: translate3d(%@px,0px,0px) scale3d(1,1,1); -moz-transform: translate3d(%@px,0px,0px); -ms-transform: translate3d(%@px,0px,0px); -o-transform: translate3d(%@px,0px,0px); transform: translate3d(%@px,0px,0px);';

    // style.push('-webkit-transition: -webkit-transform '+ speed +'ms '+ animation);
    // style.push('-moz-transition: -moz-transform '+ speed +'ms '+ animation);
    // style.push('-ms-transition: -ms-transform '+ speed +'ms '+ animation);
    // style.push('-o-transition: -o-transform '+ speed +'ms '+ animation);
    // style.push('transition: transform '+ speed +'ms '+ animation);

    // style.push('-webkit-transform: translate3d(' + x + 'px,0px,0px) scale3d(1,1,1)');
    // style.push('-moz-transform: translate3d(' + x + 'px,0px,0px)');
    // style.push('-ms-transform: translate3d(' + x + 'px,0px,0px)');
    // style.push('-o-transform: translate3d(' + x + 'px,0px,0px)');
    // style.push('transform: translate3d(' + x + 'px,0px,0px)');

    this.$().attr("style", [transition.fmt(speed +'ms '+ animation), transform.fmt(xPos)].join(" "));



    // if (!this.get('isOpen')) {

    //   Ember.run.later(this, function() {
    //     this.$().attr("style", "");
    //   }, speed + 1);

    // } else {

    //   Ember.run.later(this, function() {

    //     var style = [];

    //     style.push('-webkit-transition: none');
    //     style.push('-moz-transition: none');
    //     style.push('-ms-transition: none');
    //     style.push('-o-transition: none');
    //     style.push('transition: none');

    //     var currentStyle = this.$()[0].style;
    //     style.push('-webkit-transform: ' + currentStyle.webkitTransform || 'translate3d(0px,0px,0px) scale3d(1,1,1)');
    //     style.push('-moz-transform: ' + currentStyle.mozTransform || 'translate3d(0px,0px,0px)');
    //     style.push('-ms-transform: ' + currentStyle.msTransform || 'translate3d(0px,0px,0px)');
    //     style.push('-o-transform: ' + currentStyle.oTransform || 'translate3d(0px,0px,0px)');
    //     style.push('transform: ' + currentStyle.transform || 'translate3d(0px,0px,0px)');
        
    //     this.$().attr("style", style.join("; "));

    //   }, speed + 1);
    // }
  }




});
