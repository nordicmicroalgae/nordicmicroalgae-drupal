(function ($) {

  $(document).ready(function() {

    // Make the media metadata container collapsible.
    $('#taxon-media-metadata > h4').wrapInner('<span />').click(function() {
      $(this).toggleClass('expanded');
      $('#taxon-media-metadata > dl').slideToggle('fast', 'linear');
    });

    // Make the change history container collapsible.
    $('#change-history > h2').wrapInner('<span />').click(function() {
      $(this).toggleClass('expanded');
      $('#change-history > ul').slideToggle('fast', 'linear');
    });
  });

})(jQuery);