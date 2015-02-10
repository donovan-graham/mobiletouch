import Ember from 'ember';

export default Ember.Controller.extend({

  appMenuItems: ['main 1', 'main 2', 'main 3'],

  appSubMenuItems: ['sub 1', 'sub 2', 'sub 3', 'sub 4', 'sub 5'],

  appFooterMenuItems: ['foot 1', 'foot 2', 'foot 3', 'foot 4', 'foot 5'],

  sideMenuItems: [
    Ember.Object.create({ name: "Default List", action: "navToRoute", params: "list"}),
    Ember.Object.create({ name: "Drag List", action: "navToRoute", params: "drag-list" }),
    Ember.Object.create({ name: "Another item" }),
  ],

  actions: {
   
    toggleHeaderMenu: function() {
      document.getElementById('app-header-menu').classList.toggle('active');
    },

    toggleSubHeaderMenu: function() {
      document.getElementById('app-sub-header-menu').classList.toggle('active');
    },

    addItem: function() {
      this.set('appSubMenuItems', this.get('appSubMenuItems').addObject(Math.random()));
    },

    removeItem: function() {
      this.set('appSubMenuItems', this.get('appSubMenuItems').slice(0,-1));
    },

    navToRoute: function(routeName) {
      this.transitionToRoute(routeName);
    }

  }
});