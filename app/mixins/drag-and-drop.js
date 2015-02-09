import Ember from 'ember';

export default Ember.Mixin.create({

  // width: 0, // pixels
  // duration: 0, // milli-seconds

  lastX: 0,
  startX: null,
  startY: null,
  startZ: null,


  rafPanId: null,
  rafSlideId: null,

  // panOpen: false,
  hammer2: null,
  isDragging: false,

  // percentage: 0,
  // overlayElement: null,
  // overlayWidth: 1024,

  panElementId: null,           // corresponds to document.getElementById()
  panElementByName: null,       // corresponds to document.getElementsByName()[0]
  panElementTagName: null,      // corresponds to document.getElementsByTagName()[0]
  panElementCssSelector: null,  // corresponds to jQuery $(selector) 

  panElement: null,

  dragContainer: null,

  _setup: function() {

    // the element that will be translated
    var panElement = (this.panElementId) ? document.getElementById(this.panElementId) : 
             (this.panElementByName) ? document.getElementsByName(this.panElementByName)[0] : 
             (this.panElementTagName) ? document.getElementsByTagName(this.panElementTagName)[0] : 
             (this.panElementCssSelector) ? Ember.$(this.panElementCssSelector)[0] : 
             this.get('element');             

    this.panElement = panElement;

    this.dragContainer = document.getElementById('drag-container');



    var hammer2 = new Hammer.Manager(this.get('element'));
      hammer2.add(new Hammer.Pan({ enable: false, direction: Hammer.DIRECTION_VERTICAL, threshold: 10 }));
      hammer2.add(new Hammer.Press());
    
      hammer2.on('press', this.press.bind(this));
      hammer2.on('pressup', this.pressUp.bind(this));

      hammer2.on('panstart', this.panStart.bind(this));
      hammer2.on('panmove', this.panMove.bind(this));
      hammer2.on('panend', this.panEnd.bind(this));
    
      this.setProperties({
        hammer2: hammer2,
      });


/*
      Possible alternative 

      var hammer = new Hammer(this.get('element'), {});

      var press = new Hammer.Press();
      var vPan = new Hammer.Pan({ enable: true, direction: Hammer.DIRECTION_VERTICAL, threshold: 10 });
      var hPan = new Hammer.Pan({ enable: true, direction: Hammer.DIRECTION_HORIZONTAL, threshold: 10 });

      hammer.add([press, vPan, hPan]);

      vPan.recognizeWith(press);
      hPan.requireFailure(press);

      hammer.on('press', this.press.bind(this));

      hammer.on('panstart', this.panStart.bind(this));
      hammer.on('panmove', this.panMove.bind(this));
      hammer.on('panend', this.panEnd.bind(this));
      
      this.setProperties({
        hammer2: hammer,
      });
  */


  }.on('didInsertElement'),


  _panTeardown: function () {
    var hammer = this.get('hammer2');

    if (hammer) {
      hammer.destroy();
      this.set('hammer2', null);
    }

  }.on('willDestroyElement'),

  press: function() {
    console.log('pressed>>>>>');
    this.set('isDragging', true);
    this.get('hammer2').get('pan').set({ enable: true });
  },

  pressUp: function() {
    console.log('pressUP');
    this.set('isDragging', false);
    this.get('hammer2').get('pan').set({ enable: false });
  },

  // panUp: function() {
  //   console.log('panUp');
  // },

  panStart: function() {

      this.set('isDragging', true);

      console.log('panStart');

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
      var newY = this.startY + event.deltaY;
      // newY = Math.min(Math.max(newY, -1 * this.get('width')), 0);

      // console.log($(document.elementFromPoint(event.srcEvent.pageX, event.srcEvent.pageY)).html());

      // debugger; 
      // offset relative to top of device screen
      //console.log('screenX:', event.srcEvent.screenX, 'screenY:', event.srcEvent.screenY);

      // offset relative to top of viewport
      // console.log('clientX:', event.srcEvent.clientX, 'clientY:', event.srcEvent.clientY);
      // debugger;
      console.log(event.srcEvent.clientX,event.srcEvent.clientY );

      console.log($(document.elementFromPoint(event.srcEvent.clientX,event.srcEvent.clientY))[0].getBoundingClientRect() );

      // console.log(childNode);
      

      //offset is cursor position relative to item
      //console.log('offsetX:', event.srcEvent.offsetX, 'offsetY:', event.srcEvent.offsetY);


      if (this.lastY === newY) { return; }

      this.lastY = newY;

      var itemHeight = 41;

      // console.log(event.deltaY);
// 


      // if (event.deltaY > (itemHeight / 2)){
      //   console.log('halfway over');
      //   debugger;
      // }

      // if (event.deltaY > itemHeight){
      //   console.log('fully over');
      // }



      // this.set('percentage', Math.abs(this.lastX / this.width));

      if (!this.rafPanId) {
        this.rafPanId = window.requestAnimationFrame(this.animateVerticalDrag.bind(this));
      } 
    
  },


  panEnd: function(event) {

      console.log('panend >>>>>');

      event.target.parentNode.insertBefore(event.target, $(document.elementFromPoint(event.srcEvent.clientX,event.srcEvent.clientY))[0]);

      this.get('hammer2').get('pan').set({ enable: false });

      document.getElementsByTagName('body')[0].classList.remove('no-select');

      this.startY = null; 

      var absY = Math.abs(this.lastY);

      // this.set('percentage', (absX >= this.get('clip')) ? 1 : 0);


      if (absY === this.get('width') || absY === 0) { return; }

      if (this.rafPanId) {
        window.cancelAnimationFrame(this.rafPanId);
        this.rafPanId = null;
      }

      if (!this.rafSlideId) {
        this.rafSlideId = window.requestAnimationFrame(this.animateVerticalSlide.bind(this));
      }
    
  },


  animateVerticalDrag: function() {

    this.rafPanId = null;      // release the lock

    var newY = this.lastY,
        style = '';

    // style += 'pointer-events: none; ';


    style += '-webkit-transition: none; ';
    style += '-moz-transition: none; ';
    style += '-ms-transition: none; ';
    style += '-o-transition: none; ';
    style += 'transition: none; ';

    style += '-webkit-transform: translate3d(' + this.startX + 'px,' + newY + 'px,' + this.startZ + 'px) scale3d(1.01,1.01,1.01); ';
    style += '-moz-transform: translate3d(' + this.startX + 'px,' + newY + 'px,' + this.startZ + 'px); scale3d(1.01,1.01,1.01)';
    style += '-ms-transform: translate3d(' + this.startX + 'px,' + newY + 'px,' + this.startZ + 'px); scale3d(1.01,1.01,1.01)';
    style += '-o-transform: translate3d(' + this.startX + 'px,' + newY + 'px,' + this.startZ + 'px); scale3d(1.01,1.01,1.01)';
    style += 'transform: translate3d(' + this.startX + 'px,' + newY + 'px,' + this.startZ + 'px); scale3d(1.01,1.01,1.01)';

    this.panElement.style.cssText = style;


    // if (this.overlayElement) {
    //   var percentage = Math.abs(this.lastX / this.width);  

    //   style = 'left: -' + this.overlayWidth + 'px; width: ' + this.overlayWidth + 'px;';

    //   if (percentage === 0) {
    //     style += 'display: none; opacity: 0;';
    //   } else {
    //     style += 'display: block; opacity: ' + 0.8 * percentage + ';';
    //   }     
      
    //   this.overlayElement.style.cssText = style;
    // }

  },


  animateVerticalSlide: function() {

    this.rafSlideId = null;      // release the lock
    var _this = this;
    var newY,
        relativeDuration,
        animation = 'ease-out';

    newY = (this.get('isDragging')) ? 0: 0;

    // calculate the remaining duration (time) needed to complete the action
    relativeDuration =  '400';

    Ember.run.later(function(){
      _this.set('isDragging', false);
    }, relativeDuration);


    var style = '';   
   
    style += '-webkit-transition: -webkit-transform ' + relativeDuration + 'ms ' + animation + '; ';
    style += '-moz-transition: -moz-transform ' + relativeDuration + 'ms ' + animation + '; ';
    style += '-ms-transition: -ms-transform ' + relativeDuration + 'ms ' + animation + '; ';
    style += '-o-transition: -o-transform ' + relativeDuration + 'ms ' + animation + '; ';
    style += 'transition: transform ' + relativeDuration + 'ms ' + animation + '; ';

    style += '-webkit-transform: translate3d(' + this.startX + 'px,' + newY + 'px,' + this.startZ + 'px) scale3d(1,1,1); ';
    style += '-moz-transform: translate3d(' + this.startX + 'px,' + newY + 'px,' + this.startZ + 'px); ';
    style += '-ms-transform: translate3d(' + this.startX + 'px,' + newY + 'px,' + this.startZ + 'px); ';
    style += '-o-transform: translate3d(' + this.startX + 'px,' + newY + 'px,' + this.startZ + 'px); ';
    style += 'transform: translate3d(' + this.startX + 'px,' + newY + 'px,' + this.startZ + 'px); ';

    this.panElement.style.cssText = style;
  }


});