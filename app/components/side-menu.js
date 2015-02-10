import Ember from 'ember';
import PanElement from '../mixins/pan-element';

export default Ember.Component.extend(PanElement, {
  classNames: ['side-menu', 'no-select'],

  elementId: 'app-side-menu',

  width: 240, // pixels
  duration: 240, // milli-seconds

  // items: [],
  // itemAction: null,

  // overlayElement: null,

  // panElementId: null,
  // panElementByName: null,
  // panElementTagName: null,
  // panElementCssSelector: null,

  _setup: function() {
    this.overlayElement = document.getElementById('app-overlay');
  }.on('didInsertElement'),

  _teardown: function() {
    this.overlayElement = null;
  }.on('willDestroyElement'),


  // _yield: function(context, options, morph, blockArguments) {
  //   var view = options.data.view;
  //   var parentView = this._parentView;
  //   var template = get(this, 'template');

  //   if (template) {
  //     Ember.assert("A Component must have a parent view in order to yield.", parentView);

  //     view.appendChild(View, {
  //       isVirtual: true,
  //       tagName: '',
  //       template: template,
  //       _blockArguments: blockArguments,
  //       _contextView: parentView,
  //       _morph: morph,
  //       context: get(parentView, 'context'),
  //       controller: get(parentView, 'controller')
  //     });
  //   }
  // },


  // action: 'navTo',

  actions: {
    toggleMenu: function() {
      this.toggleProperty('panOpen');
    },

    // sendAction: function(index) {
    //   var item = this.get('items').objectAt(index);

    //   var action  = item.get('action');
    //   var params  = item.get('params');
      
    //   if (action) {
    //     this.set('itemAction', action);
    //     this.sendAction('itemAction', params)
    //   }  

    //   this.send('toggleMenu');
    // }
  }

});