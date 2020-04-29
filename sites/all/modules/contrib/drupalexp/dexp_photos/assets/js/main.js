(function ($) {
  Drupal.behaviors.dexp_photos = {
    attach: function (context, settings) {


      if(window.dexpService){
        window.dexpService.setBaseUrl(settings.basePath);
      }
      if(window.dexpRenderWidget && settings.dexp_photos){
        window.dexpRenderWidget(settings.dexp_photos.widgets, Drupal);
      }

      if(window.dexpRenderFormatter && typeof settings.dexp_photos !== 'undefined' && typeof settings.dexp_photos.formatters !== 'undefined'){
        window.dexpRenderFormatter(settings.dexp_photos.formatters, Drupal);
      }
    }
  };
}(jQuery));
