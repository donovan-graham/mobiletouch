import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['header-menu', 'no-select'],
  //classNameBindings: ['isPanOpen:open'],

  elementId: 'app-header-menu',

  width: '100%', // pixels / percentage

});