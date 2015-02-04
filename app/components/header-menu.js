import Ember from 'ember';
import SlideMenu from '../mixins/slide-menu';

export default Ember.Component.extend(SlideMenu, {
  classNames: ['sub-header-menu', 'no-select'],
  tagName: 'subheader',

  elementId: 'app-sub-header'
  

});