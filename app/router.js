import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route("list", { path: "/" });
  this.route("drag-list");
  this.route("five-hundred");

  this.resource("tasks", { path: '/tasks' }, function() {
    this.resource("tasks.detail", { path: "/detail" }, function() {
      this.route("info");  
    });
  });

});

export default Router;
