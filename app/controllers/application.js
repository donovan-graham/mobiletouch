import Ember from 'ember';

export default Ember.Controller.extend({

  sideMenuIsPanning: false,
  sideMenuOpen: false,

  appOverlayIsActive: Ember.computed.or('sideMenuIsPanning', 'sideMenuOpen'),


  appMenuItems: ['main 1', 'main 2', 'main 3'],

  appSubMenuItems: ['sub 1', 'sub 2', 'sub 3', 'sub 4', 'sub 5'],

  appFooterMenuItems: ['foot 1', 'foot 2', 'foot 3', 'foot 4', 'foot 5'],

  // sideMenuItems: [
  //   Ember.Object.create({ name: "Default List", action: "gotoDefaultList", pattern: "^list"}),
  //   Ember.Object.create({ name: "Drag List", action: "gotoDragList", pattern: "^drag-list" }),
  //   Ember.Object.create({ name: "Another item" }),
  // ],

  // observeCurrentPath: function() {
  //   var path = this.get('currentPath');
  //   console.log('path changed to: ', path);
  // }.observes('currentPath'),

  actions: {
    closeSideMenu: function() {
      var delay = 200;    // delay for application.currentPath change to propogate
      
      Ember.run.later(this, function() {
        this.set('sideMenuOpen', false);
      }, delay);
    }
  }

});