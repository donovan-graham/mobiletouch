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
  currentGroup: null,
  currentGroupIndex: null,
  currentGroupXY: null,
  
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
    this.dragContainerGroups = document.getElementsByClassName("group");

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

  setupGroupValues: function(event) {
    
    this.currentGroupXY = this.currentGroup.getBoundingClientRect();
    this.activeElement = event.target;
    this.targetElement = null;
    
  },

  panStart: function(event) {

    if ($.inArray(event.target.parentNode, this.dragContainerGroups) >= 0) {
      
      this.currentGroup = event.target.parentNode;
      this.currentGroupIndex = $.inArray(this.currentGroup, this.dragContainerGroups) +1;
      this.setupGroupValues(event);

    } else {
      return false;
    }

    this.set('isDragging', true);

  },


  panMove: function(event) {


      if (this.currentGroupIndex >= 0) {
  
        if (event.center.y <= this.currentGroupXY.top) {

          this.firstElement = this.currentGroup.firstChild.nextElementSibling;
          this.targetElement = this.firstElement;
          console.log('too high');

        } else if (event.center.y >= this.currentGroupXY.bottom){

          this.lastElement = this.currentGroup.childNodes.lastChild;
          this.targetElement = this.lastElement;
          // required to move item to last node for some reason
          this.currentGroup.insertBefore(this.activeElement, this.targetElement);

          if (this.currentGroupIndex === this.dragContainerGroups.length) {
            console.log('last group');
            return false;
          } else {
            console.log('still groups beneath');

            this.targetElement = document.elementFromPoint(event.center.x,event.center.y);

            var nextGroup = this.dragContainerGroups[this.currentGroupIndex];

            if (this.targetElement === nextGroup.firstChild.nextElementSibling){
         
              this.currentGroup = nextGroup;
              this.currentGroupIndex = this.currentGroupIndex + 1;

              this.setupGroupValues(event);

              // debugger;
              this.currentGroup.insertBefore(this.activeElement, this.currentGroup.firstChild.nextElementSibling);

            } else {
              return false;
            }
   

          }
        

        } else { 

          this.targetElement = document.elementFromPoint(event.center.x,event.center.y);

          if (this.targetElement) {

            // since we are moving nested nodes we need to make sure were using the right parent
            if (this.targetElement === this.activeElement || this.targetElement.parentNode !== this.currentGroup) {
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

    if (this.targetElement) {
      this.currentGroup.insertBefore(this.activeElement, this.targetElement);
    }

    this.rafInsertBeforeId = null;

  },


  panEnd: function() {

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
