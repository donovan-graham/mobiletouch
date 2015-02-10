import Ember from 'ember';

export default Ember.Mixin.create({

  rafInsertBeforeNodeId: null,

  hammer2: null,
  isDragging: false,

  panElementId: null,           // corresponds to document.getElementById()
  panElementByName: null,       // corresponds to document.getElementsByName()[0]
  panElementTagName: null,      // corresponds to document.getElementsByTagName()[0]
  panElementCssSelector: null,  // corresponds to jQuery $(selector) 

  panElement: null,

  dragContainer: null,
  dragContainerY: null,

  parentElement: null,
  firstElement: null,
  lastElement: null,
  activeElement: null,
  targetElement: null,

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
      hammer2.add(new Hammer.Press({time: 300}));
    
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
    this.set('isDragging', true);
    this.get('hammer2').get('pan').set({ enable: true });
    this.dragContainer.classList.add('active');
  },

  pressUp: function() {
    this.set('isDragging', false);
    this.get('hammer2').get('pan').set({ enable: false });
    this.dragContainer.classList.remove('active');
  },

  panStart: function(event) {

      this.set('isDragging', true);

      this.dragContainerY = this.dragContainer.getBoundingClientRect(); 

      this.parentElement = event.target.parentNode;
      this.activeElement = event.target;
      this.targetElement = null;

      this.firstElement = event.target.parentNode.childNodes[0];
      this.lastElement = event.target.parentNode.childNodes.lastChild;
  },


  panMove: function(event) {
            
      if (event.target.parentNode === this.dragContainer) {

        if (event.center.y <= this.dragContainerY.top) {

          this.targetElement = this.firstElement;

        } else if (event.center.y >= this.dragContainerY.bottom){

          this.targetElement = this.lastElement;

          // required to move item to last node for some reason
          this.dragContainer.insertBefore(this.activeElement, this.targetElement);

        } else { 

          this.targetElement = document.elementFromPoint(event.center.x,event.center.y);
          
          if (this.targetElement) {

            // since we are moving nested nodes we need to make sure were using the right parent
            if (this.targetElement === this.activeElement || this.targetElement.parentNode !== this.dragContainer) {
              this.targetElement = null;
            }
            
          }
        }
      }

      if (!this.rafInsertBeforeNodeId) {
        this.rafInsertBeforeId = window.requestAnimationFrame(this.insertBeforeNode.bind(this));
      }
    
  },

  insertBeforeNode: function() {
    
    var activeElement = this.activeElement;
    var targetElement = this.targetElement;

    if (targetElement) {
      this.dragContainer.insertBefore(activeElement, targetElement);
    }

    this.rafInsertBeforeId = null;

  },


  panEnd: function(event) {

      this.dragContainer.classList.remove('active');

      this.set('isDragging', false);
      
      this.get('hammer2').get('pan').set({ enable: false });

      document.getElementsByTagName('body')[0].classList.remove('no-select');

      if (this.rafInsertBeforeNodeId) {
        window.cancelAnimationFrame(this.rafInsertBeforeNodeId);
        this.rafInsertBeforeNodeId = null;
      }

  }


});
