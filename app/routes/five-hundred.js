import Ember from 'ember';

export default Ember.Route.extend({

  model: function() {
    var items = [];
    for (var i=1; i<=1000; i++) {
      items.push(i);
    }
    return items;
  }

});
