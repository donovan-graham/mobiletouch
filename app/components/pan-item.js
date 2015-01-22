import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['list-item-content'],
  // classNameBindings: ['isOpen:open'],

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
    
    hammer.on('panleft panright', function (ev) {
      var output = self.panHorizontal.apply(self, Array.prototype.slice.call(arguments));
      if (output === false) {
        if (typeof event.stopPropagation !== 'undefined') {
          event.stopPropagation();
        } else {
          event.srcEvent.stopPropagation();
        }
      }
      return output;
    });

    // hammer.on('panright', function (ev) {
    //   var output = self.panRight.apply(self, Array.prototype.slice.call(arguments));
    //   if (output === false) {
    //     if (typeof event.stopPropagation !== 'undefined') {
    //       event.stopPropagation();
    //     } else {
    //       event.srcEvent.stopPropagation();
    //     }
    //   }
    //   return output;
    // });


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
    return Math.round((this.get('revealWidth') / 2), 0);  
  }.property('revealWidth'),


  // panLeft: function(ev) {
  //   this.panStart(); 
  //   this.animateHorizontalPan(this.startX + ev.deltaX);
  // },

  // panRight: function(ev) {
  //   this.panStart(); 
  //   this.animateHorizontalPan(this.startX + ev.deltaX);
  // },


  panStart: function() {
    if (this.startX === null || this.startX === undefined) { 
      this.startX = this.$().position().left; 
    }
  },

  panHorizontal: function(ev) {
    /* 
    hammer2 fires panStart only after the first panLeft panRight.  
    So we need to manage the pan start manually. 
    */
    this.panStart(); 
    this.animateHorizontalPan(this.startX + ev.deltaX);
  },


  panEnd: function(ev) {
    var absX = Math.abs(this.lastX);
    this.startX = null; 

    if (absX >= this.get('revealClip')) {
       this.set('isOpen', true);
    } else {
      this.set('isOpen', false);
    }

    if (absX === this.get('revealWidth') || absX === 0) { return; }

    this.animateHorizontalSlide();
  },


  animateHorizontalPan: function(xPos) {
    
    xPos = Math.min(Math.max(xPos, -1 * this.get('revealWidth')), 0);

    if (this.lastX === xPos) { return; }  // don't need to make any new changes
 
    this.lastX = xPos;

    var style = '';

    style += '-webkit-transition: none; ';
    style += '-moz-transition: none; ';
    style += '-ms-transition: none; ';
    style += '-o-transition: none; ';
    style += 'transition: none; ';

    style += '-webkit-transform: translate3d(' + xPos + 'px,0px,0px) scale3d(1,1,1); ';
    style += '-moz-transform: translate3d(' + xPos + 'px,0px,0px); ';
    style += '-ms-transform: translate3d(' + xPos + 'px,0px,0px); ';
    style += '-o-transform: translate3d(' + xPos + 'px,0px,0px); ';
    style += 'transform: translate3d(' + xPos + 'px,0px,0px); ';

    this.$()[0].style.cssText = style;
  },


  animateHorizontalSlide: function() {

     var xPos,
        relativeDuration,
        animation = 'ease-out';

    xPos = (this.get('isOpen')) ? -1 * this.get('revealWidth') : 0;

    // xPos = Math.min(Math.max(xPos, -1 * this.get('revealWidth')), 0);
 
    // if (this.lastX === xPos) { return; }  // don't need to make any new changes
 

    // var speed = this.get('revealClip') / this.get('duration'); // pixels per millisecond
    // var distance = Math.abs(xPos - this.lastX);
    // var duration = distance / speed;
    // console.log("lastX: ", this.lastX, ", xPos:", xPos , " duration:", v);

    // calculate the remaining duration (time) needed to complete the action
    relativeDuration =  Math.abs(xPos - this.lastX) / (this.get('revealClip') / this.get('duration'));


    var style = '';   
   
    style += '-webkit-transition: -webkit-transform ' + relativeDuration + 'ms ' + animation + '; ';
    style += '-moz-transition: -moz-transform ' + relativeDuration + 'ms ' + animation + '; ';
    style += '-ms-transition: -ms-transform ' + relativeDuration + 'ms ' + animation + '; ';
    style += '-o-transition: -o-transform ' + relativeDuration + 'ms ' + animation + '; ';
    style += 'transition: transform ' + relativeDuration + 'ms ' + animation + '; ';

    style += '-webkit-transform: translate3d(' + xPos + 'px,0px,0px) scale3d(1,1,1); ';
    style += '-moz-transform: translate3d(' + xPos + 'px,0px,0px); ';
    style += '-ms-transform: translate3d(' + xPos + 'px,0px,0px); ';
    style += '-o-transform: translate3d(' + xPos + 'px,0px,0px); ';
    style += 'transform: translate3d(' + xPos + 'px,0px,0px); ';

    this.$()[0].style.cssText = style;
  }


});
