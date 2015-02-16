import Ember from 'ember';

export default Ember.Mixin.create({

  // classNames: ['child-of-mine'],

  _runTransition: function() {

    console.log("childNum:", this.get('childNum'));


    // this.container.lookup('router:main').get('router.currentHandlerInfos');
    var path = this.container.lookup('controller:application').get('currentPath').split('.');

    var offset = path.length;

    console.log('path:', path);

    if (path[offset-1] === 'index') {
      offset -= 1;
    }

    console.log('offset:', offset);

 
    if (this.get('childNum') === offset) {
      offset -= 1;
      $('#main-parent').css({left: '-' + (offset * 100) + '%'});
    }

  }.on('didInsertElement'),


  _teardownTransition: function() {

    // this.container.lookup('router:main').get('router.currentHandlerInfos');
    var path = this.container.lookup('controller:application').get('currentPath').split('.');

    var offset = path.length;

    console.log('path:', path);

    if (path[offset-1] === 'index') {
      offset -= 1;
    }

    console.log('offset:', offset);
    
    offset -= 1;
    $('#main-parent').css({left: '-' + (offset * 100) + '%'});


  }.on('willDestroyElement'),


});
