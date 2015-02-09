import Ember from 'ember';

export default Ember.Route.extend({
  
  model: function() {
    var items;

    items = [];
    for (var i=0; i <= 50; i++) {
      items.push(i);
    }

    return items;
  }


});
