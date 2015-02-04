import Ember from 'ember';



// import cssTrans from '../utils/cssTransforms';

var cssTranslate3D = function (x,y,z) {
  var style = '';
  style += '-webkit-transform: translate3d(' + x + 'px, ' + y + 'px, ' + z + 'px) scale3d(1,1,1); ';
  style += '-moz-transform: translate3d(' + x + 'px, ' + y + 'px, ' + z + 'px); ';
  style += '-ms-transform: translate3d(' + x + 'px, ' + y + 'px, ' + z + 'px); ';
  style += '-o-transform: translate3d(' + x + 'px, ' + y + 'px, ' + z + 'px); ';
  style += 'transform: translate3d(' + x + 'px, ' + y + 'px, ' + z + 'px); ';
  return style;
};

var cssTransition = function (prop, duration, animation) {
  var style = '';  
  style += '-webkit-transition: -webkit-' + prop + ' ' + duration + 'ms ' + animation + '; ';
  style += '-moz-transition: -moz-' + prop + ' ' + duration + 'ms ' + animation + '; ';
  style += '-ms-transition: -ms-' + prop + ' ' + duration + 'ms ' + animation + '; ';
  style += '-o-transition: -o-' + prop + ' ' + duration + 'ms ' + animation + '; ';
  style += 'transition: ' + prop + ' ' + duration + 'ms ' + animation + '; ';
  return style;
};

var cssTransitionTransform = function (duration, animation) {
  return cssTransition('transform', duration, animation);
};

var cssTransitionNone = function () {
  var style = '';  
  style += '-webkit-transition: " "; ';
  style += '-moz-transition: " "; ';
  style += '-ms-transition: " "; ';
  style += '-o-transition: " "; ';
  style += 'transition: " "; ';
  return style;
};





export default Ember.Component.extend({
  classNames: ['sub-header-menu', 'no-select'],
  tagName: 'subheader',

  elementId: 'app-sub-header',
  isOpen: false,

  items: null,   // []
  itemHeight: 20,
  itemDuration: 20, // ms

  menuElement: null,
  menuHeight: 0,

  rafMenuId: null,


  positionMenu: function() {
    this.menuHeight = this.get('items.length') * this.get('itemHeight');
    var newY = (this.get('isOpen')) ? 0 : -1 * this.menuHeight;
    this.menuElement.style.cssText = cssTransitionNone() + cssTranslate3D(0, newY, 0);
  },


  _setupHeaderMenu: function() {
    this.menuElement = this.$().find('ul.menu')[0];
    this.positionMenu();
  }.on('didInsertElement'),


  observeItemsLength: function() {
    this.positionMenu();
  }.observes('items.length'),


  totalDuration: function() {
    return this.get('items.length') * this.get('itemDuration');
  }.property('items.length', 'itemDuration'),


  slideAnimation: function() {
    this.rafMenuId = null;      // release the lock
    var newY = (this.get('isOpen')) ? 0 : -1 * this.menuHeight;

    this.menuElement.style.cssText = cssTransitionTransform(this.get('totalDuration'), 'linear') + cssTranslate3D(0, newY, 0);
  }, 


  actions: {
    toggleMenu: function() {      
      if (!this.get('items.length')) { return; }

      this.toggleProperty('isOpen');
      if (!this.rafMenuId) {
        this.rafMenuId = window.requestAnimationFrame(this.slideAnimation.bind(this));
      }
    }
  }




});