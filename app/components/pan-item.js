import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['list-item-content'],
  // classNameBindings: ['isOpen:open'],

  width: 200, // pixels
  duration: 200, // milli-seconds

  lastX: 0,
  startX: null,

  rafPanId: null,
  rafSlideId: null,

  isOpen: false,
  hammer: null, 

  panSelector: null,
  panElement: null,

  _setupHammer: function() {

    // Needs more love 
    // var el = (this.get('panSelector')) ? Ember.$('panSelector')[0] : this.get('element'); 

    var el = this.get('element'); 


    var hammer = new Hammer(el);

    hammer.get('pan').set({
      direction: Hammer.DIRECTION_HORIZONTAL,
      threshold: 10
    });
    
    hammer.on('panstart', this.panStart.bind(this));
    hammer.on('panmove', this.panMove.bind(this));
    hammer.on('panend', this.panEnd.bind(this));
 
    this.setProperties({
      hammer: hammer,
      panElement: el
    });
    // PreventGhostClicks.add(el);
  }.on('willInsertElement'),


  _teardownHammer: function () {
    var hammer = this.get('hammer');

    if (hammer) {
      hammer.destroy();
      this.set('hammer', null);
    }

    // PreventGhostClicks.remove(element);
  }.on('willDestroyElement'),


  panStart: function() {    
    this.startX = Ember.$(this.get('panElement')).position().left;       

    if (this.rafSlideId) {
      window.cancelAnimationFrame(this.rafSlideId);
      this.rafSlideId = null;
    }
  },


  panMove: function(event) {
    var newX = this.startX + event.deltaX;
    newX = Math.min(Math.max(newX, -1 * this.get('width')), 0);

    if (this.lastX === newX) { return; }

    this.lastX = newX;

    if (!this.rafPanId) {
      this.rafPanId = window.requestAnimationFrame(this.animateHorizontalPan.bind(this));
    }  
  },


  panEnd: function() {
    this.startX = null; 

    var absX = Math.abs(this.lastX);

    this.set('isOpen', (absX >= this.get('clip')));

    if (absX === this.get('width') || absX === 0) { return; }

    if (this.rafPanId) {
      window.cancelAnimationFrame(this.rafPanId);
      this.rafPanId = null;
    }

    if (!this.rafSlideId) {
      this.rafSlideId = window.requestAnimationFrame(this.animateHorizontalSlide.bind(this));
    }
  },


  clip: function() {
    return Math.round((this.get('width') / 2), 0);  
  }.property('width'),


  animateHorizontalPan: function() {

    this.rafPanId = null;      // release the lock

    var xPos = this.lastX,
        style = '';

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

    this.get('panElement').style.cssText = style;
  },


  animateHorizontalSlide: function() {

    this.rafSlideId = null;      // release the lock

    var xPos,
        relativeDuration,
        animation = 'ease-out';

    xPos = (this.get('isOpen')) ? -1 * this.get('width') : 0;

    // calculate the remaining duration (time) needed to complete the action
    relativeDuration =  Math.abs(xPos - this.lastX) / (this.get('clip') / this.get('duration'));


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

    this.get('panElement').style.cssText = style;
  }


});
