import Ember from 'ember';

export default Ember.Mixin.create({

  width: 0, // pixels
  duration: 0, // milli-seconds

  lastX: 0,
  startX: null,
  startY: null,
  startZ: null,


  rafPanId: null,
  rafSlideId: null,

  panOpen: false,
  hammer: null, 

  percentage: 0,
  overlayElement: null,
  overlayWidth: 1024,

  panElementId: null,           // corresponds to document.getElementById()
  panElementByName: null,       // corresponds to document.getElementsByName()[0]
  panElementTagName: null,      // corresponds to document.getElementsByTagName()[0]
  panElementCssSelector: null,  // corresponds to jQuery $(selector) 

  panElement: null,

  _panSetup: function() {

    // the element that will be translated
    var panElement = (this.panElementId) ? document.getElementById(this.panElementId) : 
             (this.panElementByName) ? document.getElementsByName(this.panElementByName)[0] : 
             (this.panElementTagName) ? document.getElementsByTagName(this.panElementTagName)[0] : 
             (this.panElementCssSelector) ? Ember.$(this.panElementCssSelector)[0] : 
             this.get('element');             

    this.panElement = panElement;

    // the element that handle the drag event
    var hammer = new Hammer(this.get('element'));

    hammer.get('pan').set({
      direction: Hammer.DIRECTION_HORIZONTAL,
      threshold: 10
    });
    
    hammer.on('panstart', this.panStart.bind(this));
    hammer.on('panmove', this.panMove.bind(this));
    hammer.on('panend', this.panEnd.bind(this));
 
    this.setProperties({
      hammer: hammer,
    });

    this.overlayWidth = Ember.$(document).width();

    // PreventGhostClicks.add(this.get('element'));
  }.on('didInsertElement'),


  _panTeardown: function () {
    var hammer = this.get('hammer');

    if (hammer) {
      hammer.destroy();
      this.set('hammer', null);
    }

    // PreventGhostClicks.remove(this.get('element'));
  }.on('willDestroyElement'),


  panStart: function() {
    // document.getElementsByTagName('body')[0].classList.add('no-select');

    // This version is buggy ... giving NaN
    // var matrix = Ember.$(this.panElement).css('transform'); 
    // console.log("matrix", matrix); 
    // matrix = matrix.substr(7, matrix.length - 8).split(', ');
    // this.startX = parseFloat(matrix[4]);



    var style = window.getComputedStyle(this.panElement);  // Need the DOM object
    var matrix = new WebKitCSSMatrix(style.webkitTransform);
    this.startX = matrix.m41;
    this.startY = matrix.m42;
    this.startZ = matrix.m43;


    if (this.rafSlideId) {
      window.cancelAnimationFrame(this.rafSlideId);
      this.rafSlideId = null;
    }
  },


  panMove: function(event) {
    // x cant be more origin
    // x cant be less than orign - width
    var newX = this.startX + event.deltaX;
    newX = Math.min(Math.max(newX, -1 * this.get('width')), 0);

    if (this.lastX === newX) { return; }

    this.lastX = newX;

    // this.set('percentage', Math.abs(this.lastX / this.width));

    if (!this.rafPanId) {
      this.rafPanId = window.requestAnimationFrame(this.animateHorizontalPan.bind(this));
    }  
  },


  panEnd: function() {
    document.getElementsByTagName('body')[0].classList.remove('no-select');

    this.startX = null; 

    var absX = Math.abs(this.lastX);

    this.set('panOpen', (absX >= this.get('clip')));

    // this.set('percentage', (absX >= this.get('clip')) ? 1 : 0);


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

    this.panElement.style.cssText = style;


    if (this.overlayElement) {
      var percentage = Math.abs(this.lastX / this.width);  

      style = 'left: -' + this.overlayWidth + 'px; width: ' + this.overlayWidth + 'px;';

      if (percentage === 0) {
        style += 'display: none; opacity: 0;';
      } else {
        style += 'display: block; opacity: ' + 0.8 * percentage + ';';
      }     
      
      this.overlayElement.style.cssText = style;
    }

  },


  animateHorizontalSlide: function() {

    this.rafSlideId = null;      // release the lock

    var newX,
        relativeDuration,
        animation = 'ease-out';

    newX = (this.get('panOpen')) ? -1 * this.get('width') : 0;

    // calculate the remaining duration (time) needed to complete the action
    relativeDuration =  Math.abs(newX - this.lastX) / (this.get('clip') / this.get('duration'));


    var style = '';   
   
    style += '-webkit-transition: -webkit-transform ' + relativeDuration + 'ms ' + animation + '; ';
    style += '-moz-transition: -moz-transform ' + relativeDuration + 'ms ' + animation + '; ';
    style += '-ms-transition: -ms-transform ' + relativeDuration + 'ms ' + animation + '; ';
    style += '-o-transition: -o-transform ' + relativeDuration + 'ms ' + animation + '; ';
    style += 'transition: transform ' + relativeDuration + 'ms ' + animation + '; ';

    style += '-webkit-transform: translate3d(' + newX + 'px,' + this.startY + 'px,' + this.startZ + 'px) scale3d(1,1,1); ';
    style += '-moz-transform: translate3d(' + newX + 'px,' + this.startY + 'px,' + this.startZ + 'px); ';
    style += '-ms-transform: translate3d(' + newX + 'px,' + this.startY + 'px,' + this.startZ + 'px); ';
    style += '-o-transform: translate3d(' + newX + 'px,' + this.startY + 'px,' + this.startZ + 'px); ';
    style += 'transform: translate3d(' + newX + 'px,' + this.startY + 'px,' + this.startZ + 'px); ';

    this.panElement.style.cssText = style;
  }


});
