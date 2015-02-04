import Ember from 'ember';
import cssTranslate3D from '../utils/css-translate3d';
import cssTransitionTransform from '../utils/css-transition-transform';
import cssTransitionNone from '../utils/css-transition-none';

export default Ember.Mixin.create({

  classNames: ['app-menu', 'no-select'],

  isOpen: false,

  items: null,   // []
  itemHeight: 20,
  itemDuration: 20, // ms

  menuElement: null,
  menuHeight: 0,

  rafMenuId: null,

  origin: 'top',


  positionMenu: function() {
    this.menuHeight = this.get('items.length') * this.get('itemHeight');
    this.menuElement.style.cssText = cssTransitionNone() + cssTranslate3D(0, this.newY(), 0);
  },

  newY: function() {
    var newY;

    if (this.get('origin') === 'top') {
      newY = (this.get('isOpen')) ? 0 : -1 * this.menuHeight;
    } else {
      newY = (this.get('isOpen')) ? -1 * this.menuHeight : 0;      
    }
    return newY;
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
    this.menuElement.style.cssText = cssTransitionTransform(this.get('totalDuration'), 'linear') + cssTranslate3D(0, this.newY(), 0);
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