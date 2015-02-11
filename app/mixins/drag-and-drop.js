import Ember from 'ember';

export default Ember.Mixin.create({

  rafInsertBeforeNodeId: null,
  rafInsertAfterNodeId: null,

  hammer2: null,
  isDragging: false,

  panElementId: null,           // corresponds to document.getElementById()
  panElementByName: null,       // corresponds to document.getElementsByName()[0]
  panElementTagName: null,      // corresponds to document.getElementsByTagName()[0]
  panElementCssSelector: null,  // corresponds to jQuery $(selector) 

  panElement: null,

  dragContainer: null,
  
  totalGroups: null,
  currentGroup: null,

  firstGroupFirstElement: null,
  lastGroupLastElement: null, 

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
    this.activeElement = event.target;
    this.targetElement = null;
  },

  panStart: function(event) {

    this.currentGroup = $(event.target).closest('.group')[0];
    
    if ($.inArray(this.currentGroup, this.dragContainerGroups) < 0) { return false; }
   
    this.setupGroupValues(event);

    this.firstGroupFirstElement = this.dragContainerGroups[0].getElementsByTagName('div')[0];

    this.totalGroups = this.dragContainerGroups.length;
    this.lastGroupLastElement = this.dragContainerGroups[(this.totalGroups -1)].lastElementChild;
    
    this.set('isDragging', true);

  },


  panMove: function(event) {
        
    // this.currentGroup = $(event.target).closest('.group')[0];
    this.targetElement = document.elementFromPoint(event.center.x,event.center.y);

    // stop if targetElement is not a related drag item we dont care
    if (!this.targetElement.classList.contains('drag-item')) { return; }

    //check if activeElement isnt targeElement (unsure if this is still required)
    if (this.targetElement === this.activeElement) { return; }

    // stop if activeElement is first/last in first/last group and moving out of area
    if ((this.firstGroupFirstElement === this.activeElement && event.direction === 8) || (this.lastGroupLastElement === this.activeElement && event.direction === 16)){ return; }  
      
    if (this.targetElement === this.targetElement.parentNode.lastElementChild) {
      if (!this.rafInsertAfterNodeId) {
        this.rafInsertAfterId = window.requestAnimationFrame(this.insertAfterNode.bind(this));
      }
      return;
    }

    if (!this.rafInsertBeforeNodeId) {
      console.log('before;')
      this.rafInsertBeforeId = window.requestAnimationFrame(this.insertBeforeNode.bind(this));
    }
    
  },

  insertAfterNode: function() {
    if (this.targetElement) {
      $(this.activeElement).insertAfter(this.targetElement);
    }
    this.rafInsertAfterId = null;
  },

  insertBeforeNode: function() {
    if (this.targetElement) {
      $(this.targetElement).closest('.group')[0].insertBefore(this.activeElement, this.targetElement);
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

      if (this.rafInsertAfterNodeId) {
        window.cancelAnimationFrame(this.rafInsertAfterNodeId);
        this.rafInsertAfterNodeId = null;
      }

  }


});
