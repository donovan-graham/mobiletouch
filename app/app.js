import Ember from 'ember';
import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';
import config from './config/environment';

Ember.MODEL_FACTORY_INJECTIONS = true;

var App = Ember.Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver: Resolver
});

loadInitializers(App, config.modulePrefix);


Ember.Router.reopen({
  transitionTo: function(name, context) {
    this.container.lookup('controller:application').send('closeSideMenu');
    var router = this.router;
    return router.transitionTo.apply(router, arguments);
  },

  resetScroll: function() {
    window.scrollTo(0,0);
  }.on('willTransition'),

});


/* 
// Moved into ember-mobiletouch, and configured in environment.js 

Ember.EventDispatcher.reopen({
  events: {
    keydown     : 'keyDown',
    keyup       : 'keyUp',
    keypress    : 'keyPress',
    contextmenu : 'contextMenu',
    click       : 'click',
    dblclick    : 'doubleClick',
    focusin     : 'focusIn',
    focusout    : 'focusOut',
    submit      : 'submit',
    input       : 'input',
    change      : 'change',
  },
});
*/

export default App;



