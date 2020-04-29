<?php

function dexp_shortcodes_maps_shortcode_info(&$shortcodes) {
  $shortcodes['maps'] = array(
      'title' => t('Maps'),
      'description' => t('Create maps shortcode'),
      'process callback' => 'dexp_shortcodes_maps',
      'tips callback' => 'dexp_shortcodes_maps_tips',
  );
}

function dexp_shortcodes_maps($attrs, $text) {
  $attrs = shortcode_attrs(array(
      'class' => '', // font awesome class 
      'link' => '',
      'title' =>'',
      'image' =>'',
      'phone'=> '',
      'zoom'=>'10',
      'marker'=>'http://statics.drupalexp.com/jollyness/marker.png'), $attrs);
  $attrs['content'] = $text;
  return trim(theme('dexp_shortcodes_maps', $attrs));
}

function dexp_shortcodes_maps_theme(&$themes) {
  $path = drupal_get_path('module', 'dexp_shortcodes');
  $themes['dexp_shortcodes_maps'] = array(
      'template' => 'maps',
      'path' => $path . '/theme',
      'pattern' => 'shortcode__',
      'preprocess functions' => array(
          'template_preprocess',
          'dexp_shortcodes_preprocess_shortcode_maps',
      ),
      'variables' => array(
          'class' => '',
          'link' => '',
          'title' =>'',
          'image' =>'',
          'phone'=> '',
          'zoom'=>'10',
          'marker'=>'http://statics.drupalexp.com/jollyness/marker.png',
          'content' => '',
      )
  );
}

function dexp_shortcodes_preprocess_shortcode_maps(&$vars) {
  $vars['theme_hook_suggestions'][] = 'shortcode__maps';
}

function dexp_shortcodes_maps_tips($format, $long) {
  $output = "[maps class='' link='' title='' image='' phone='' zoom='' marker='']ADDRESS[/maps]";
  return $output;
}