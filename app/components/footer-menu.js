import Ember from 'ember';
import AppMenu from '../mixins/app-menu';

export default Ember.Component.extend(AppMenu, {
  
  tagName: 'footer',
  origin: 'bottom'
  
});