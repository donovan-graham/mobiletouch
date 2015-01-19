import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['list-item-content'],

  revealWidth: 200, // pixels
  duration: 200, // milli-seconds

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
      this.set('isOpen', true);

    } else {
      this.set('isOpen', false);
    }

    this.animateHorizontalSlide();
    this.startX = null; 
  },


  animateHorizontalPan: function(xPos) {
    xPos = Math.min(Math.max(xPos, -1 * this.get('revealWidth')), 0);

    this.lastX = xPos;

    var style = [];

    var transitionNone = '-webkit-transition: none; -moz-transition: none; -ms-transition: none; -o-transition: none; transition: none;',
        transform =  '-webkit-transform: translate3d(%@1px,0px,0px) scale3d(1,1,1); -moz-transform: translate3d(%@1px,0px,0px); -ms-transform: translate3d(%@1px,0px,0px); -o-transform: translate3d(%@1px,0px,0px); transform: translate3d(%@1px,0px,0px);';

    // Test 1
    // var style = this.$()[0].style;   
    // style.webkitTransition = 'none';
    // style.mozTransition = 'none';
    // style.msTransition = 'none';
    // style.oTransition = 'none';
    // style.transition = 'none';
    // style.webkitTransform = 'translate3d(' + xPos + 'px,0px,0px) scale3d(1,1,1)';
    // style.mozTransform = 'translate3d(' + xPos + 'px,0px,0px)';
    // style.msTransform = 'translate3d(' + xPos + 'px,0px,0px)';
    // style.oTransform = 'translate3d(' + xPos + 'px,0px,0px)';
    // style.transform = 'translate3d(' + xPos + 'px,0px,0px)';
    // this.$()[0].style = style;

    // Test 2
    // this.$().attr("style", [transitionNone, transform.fmt(xPos)].join(" "));

    // Test 3
    this.$()[0].style.cssText = [transitionNone, transform.fmt(xPos)].join(" ");

  },


  animateHorizontalSlide: function() {

    var xPos,
        relativeDuration,
        animation = 'ease-out',
        transitionNone = '-webkit-transition: none; -moz-transition: none; -ms-transition: none; -o-transition: none; transition: none;',
        transition = '-webkit-transition: -webkit-transform %@1; -moz-transition: -moz-transform %@1; -ms-transition: -ms-transform %@1; -o-transition: -o-transform %@1; transition: transform %@1;',
        transform =  '-webkit-transform: translate3d(%@1px,0px,0px) scale3d(1,1,1); -moz-transform: translate3d(%@1px,0px,0px); -ms-transform: translate3d(%@1px,0px,0px); -o-transform: translate3d(%@1px,0px,0px); transform: translate3d(%@1px,0px,0px);';

    xPos = (this.get('isOpen')) ? -1 * this.get('revealWidth') : 0;

    // var speed = this.get('revealClip') / this.get('duration'); // pixels per millisecond
    // var distance = Math.abs(xPos - this.lastX);
    // var duration = distance / speed;
    // console.log("lastX: ", this.lastX, ", xPos:", xPos , " duration:", v);

    // calculate the remaining duration (time) needed to complete the action
    relativeDuration =  Math.abs(xPos - this.lastX) / (this.get('revealClip') / this.get('duration'));


    // Test 1
    // var style = this.$()[0].style;   
    // style.webkitTransition = 'transform ' + relativeDuration + 'ms ' + animation;
    // style.mozTransition = 'transform ' + relativeDuration + 'ms ' + animation;
    // style.msTransition = 'transform ' + relativeDuration + 'ms ' + animation;
    // style.oTransition = 'transform ' + relativeDuration + 'ms ' + animation;
    // style.transition = 'transform ' + relativeDuration + 'ms ' + animation;
    // style.webkitTransform = 'translate3d(' + xPos + 'px,0px,0px) scale3d(1,1,1)';
    // style.mozTransform = 'translate3d(' + xPos + 'px,0px,0px)';
    // style.msTransform = 'translate3d(' + xPos + 'px,0px,0px)';
    // style.oTransform = 'translate3d(' + xPos + 'px,0px,0px)';
    // style.transform = 'translate3d(' + xPos + 'px,0px,0px)';
    // this.$()[0].style = style;
    
    // Test 2
    // this.$().attr("style", [transition.fmt(relativeDuration +'ms '+ animation), transform.fmt(xPos)].join(" "));

    // Test 3
    this.$()[0].style.cssText = [transition.fmt(relativeDuration +'ms '+ animation), transform.fmt(xPos)].join(" ");

    // if (!this.get('isOpen')) {
    //   Ember.run.later(this, function() {
    //     this.$().attr("style", "");
    //   }, relativeDuration + 1);
    // } else {
    //   Ember.run.later(this, function() {
    //     this.$().attr("style", [transitionNone, transform.fmt(xPos)].join(" "));
    //   }, relativeDuration + 1);
    // }
  }


});
