import Ember from 'ember';

export default Ember.Controller.extend({
  sideMenuProgress: 0,


  appMenuItems: ['main 1', 'main 2', 'main 3'],

  appSubMenuItems: ['sub 1', 'sub 2', 'sub 3', 'sub 4', 'sub 5'],

  appFooterMenuItems: ['foot 1', 'foot 2', 'foot 3', 'foot 4', 'foot 5'],

  // appMenuItems: function() {
  //   return ['main 1', 'main 2', 'main 3'];
  // }.property(),


  // appSubMenuItems: function() {
  //   return ['sub 1', 'sub 2', 'sub 3', 'sub 4', 'sub 5'];
  // }.property(),


  actions: {
    toggleSideMenu: function(val) {
      if (this.get('sideMenuProgress') === 0) {
        this.set('sideMenuProgress', 1);
      } else {
        this.set('sideMenuProgress', 0);
      }
    },

    toggleHeaderMenu: function() {
      Ember.$('#app-header-menu').toggleClass('active');
    },

    toggleSubHeaderMenu: function() {
      Ember.$('#app-sub-header-menu').toggleClass('active');
    },

    addItem: function() {
      this.set('appSubMenuItems', this.get('appSubMenuItems').addObject(Math.random()));
    },

    removeItem: function() {
      this.set('appSubMenuItems', this.get('appSubMenuItems').slice(0,-1));
    }

  }
});