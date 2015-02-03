import Ember from 'ember';

export default Ember.Controller.extend({
  sideMenuProgress: 0,

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
    }
  }
});