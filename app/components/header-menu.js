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
}

var cssTransition = function (duration, animation) {
  var style = '';  
  style += '-webkit-transition: -webkit-transform ' + duration + 'ms ' + animation + '; ';
  style += '-moz-transition: -moz-transform ' + duration + 'ms ' + animation + '; ';
  style += '-ms-transition: -ms-transform ' + duration + 'ms ' + animation + '; ';
  style += '-o-transition: -o-transform ' + duration + 'ms ' + animation + '; ';
  style += 'transition: transform ' + duration + 'ms ' + animation + '; ';
  return style;
}



export default Ember.Component.extend({
  classNames: ['sub-header-menu', 'no-select'],
  tagName: 'subheader',

  elementId: 'app-sub-header',
  isOpen: false,

  items: null,   // []
  itemHeight: 20,
  itemDuration: 20, // ms

  menuElement: null,
  rafMenuId: null,

  totalHeight: function() {
    return this.get('items.length') * this.get('itemHeight');
  }.property('items.length', 'itemHeight'),


  totalDuration: function() {
    return this.get('items.length') * this.get('itemDuration');
  }.property('items.length', 'itemDuration'),


  _setupHeaderMenu: function() {
    this.menuElement = this.$().find('ul.menu')[0];
    var newY = (this.get('isOpen')) ? 0 : -1 * this.get('totalHeight');
    this.menuElement.style.cssText = cssTranslate3D(0, newY, 0);
  }.on('didInsertElement'),


  slideAnimation: function() {
    this.rafMenuId = null;      // release the lock
    var newY = (this.get('isOpen')) ? 0 : -1 * this.get('totalHeight');
    this.menuElement.style.cssText = cssTransition(this.get('totalDuration'), 'linear') + cssTranslate3D(0, newY, 0);
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