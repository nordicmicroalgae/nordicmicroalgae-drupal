(function ($) {
  
  $(document).ready(function() {
    // Add control for toggling image column in taxon lists.
    if ($('div.taxon-list').length) {
      var image_toggle = $('<input />')
        .attr('type', 'checkbox')
        .attr('checked', true)
        .change(toggleImageColumn);
      
      $('<label>Show images</label>')
        .prepend(image_toggle)
        .prependTo($('div.taxon-list'));
    }
  });
  
  function toggleImageColumn() {
    $('div.taxon-list').toggleClass('hide-images', !$(this).attr('checked'));
  }
  
})(jQuery);