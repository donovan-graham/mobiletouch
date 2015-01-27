import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['side-menu'],

  /*
  TODO:
  Move toggle button + opacity inside the side menu and handle positioning with css.


  REFERENCE:
  http://miguelcamba.com/blog/2015/01/01/screencast-create-a-touch-menu-component-in-ember-dot-js/?utm_source=Ember+Weekly&utm_campaign=c98ea83fe1-Ember_Weekly_Issue_91&utm_medium=email&utm_term=0_e96229d21d-c98ea83fe1-106351745

  */

  node: null,
  progress: 0,

  sideMenuWidth: 200, /* px */

  setup: function() {
    this.node = Ember.$('body')[0];
  }.on('init'),

  // animateMenu: function() {
  //   var translate = (this.get('progress') * -1 ) * this.get('sideMenuWidth');
  //   this.node.style.cssText = 'transform: translate3d(' + translate + 'px,0px,0px);';
  // }.observes('progress'),


  

});
