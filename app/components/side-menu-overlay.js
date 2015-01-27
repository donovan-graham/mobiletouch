import Ember from 'ember';

export default Ember.Component.extend({
  attributeBindings: ['style'],
  classNames: ['side-menu-overlay'],
  progress: 0,

  style: function() {    
    var style = '';
    style += 'opacity:' + this.get('progress') + '; ';
    style += 'display:' + ((this.get('progress') === 0) ? 'none' : 'block')  + '; ';
    return style;
  }.property('progress'),

});