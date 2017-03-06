/**
 * Basic functionality for the taxon module.
 */
(function ($) {

  Drupal.taxon = {};

  /**
   * Returns the internal URL for a taxon.
   *
   * Slashes are replaced by underscores before the name is being encoded.
   */
  Drupal.taxon.url = function(name) {
    name = name.replace(/\//g, '_');
    return '/taxon/' + encodeURIComponent(name);
  }

})(jQuery);