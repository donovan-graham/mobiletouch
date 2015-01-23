import Ember from 'ember';

export default Ember.Component.extend({
  node: null,
  progress: 0,

  sideMenuWidth: 200, /* px */

  setup: function() {
    this.node = Ember.$('body')[0];
    // this.node.style.cssText = 'transform: translate3d(0px,0px,0px);';
  }.on('init'),

  animateMenu: function() {
    var translate = (this.get('progress') * -1 ) * this.get('sideMenuWidth');
    this.node.style.cssText = 'transform: translate3d(' + translate + 'px,0px,0px);';
  }.observes('progress'),

});
