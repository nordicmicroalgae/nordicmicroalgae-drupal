(function($) {
  
  $(function() {
    $('#taxon-media-list-form').prepend('<p><strong>Note:</strong> Sort the sequence of images using drag and drop, the lefthand image will be the default.</p>');
    
    $('#taxon-media-manage-list').sortable({
      update: function(event, ui) {
        var media_list = [];
        $('#taxon-media-manage-list > li > span').each(function() {
          media_list.push($(this).html());
        });
        
        $('input[name=media_list]').val(media_list.join(';'));
      }
    });
  })

  
})(jQuery);