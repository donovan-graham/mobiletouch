/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'mobiletouch',
    environment: environment,
    baseURL: '/',
    locationType: 'hash',
    
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true

        'ember-htmlbars-component-generation': true,
        'ember-htmlbars-attribute-syntax': true,
        'ember-htmlbars-each-with-index': true
      }
    },


    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };


  // https://github.com/rwjblue/ember-cli-content-security-policy
  // http://content-security-policy.com/
  ENV.contentSecurityPolicy = {
      'default-src': "'none'",
      'script-src': "'self' 'unsafe-inline'",
      'frame-src': "'self'",
      'font-src': "'self'",
      'connect-src': "'self' https://*.firebase.com https://*.firebaseio.com wss://*.firebaseio.com",
      'img-src': "'self' data:",
      'style-src': "'self' 'unsafe-inline'", 
      'report-uri': "'http://localhost:4200'"
  };


  ENV.mobileTouch = {
    use : ['fastclick', 'press', 'swipe', 'tap'],
    fastclick: true,
    events: {
      keydown     : 'keyDown',
      keyup       : 'keyUp',
      keypress    : 'keyPress',
      contextmenu : 'contextMenu',
      focusin     : 'focusIn',
      focusout    : 'focusOut',
      submit      : 'submit',
      input       : 'input',
      change      : 'change',
    }
  };

  ENV.useFixtureData = false; /* for local development */

  ENV.useFirebase != ENV.useFixtureData;
  ENV.firebase = 'mobiletouch';

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {

  }

  return ENV;
};
