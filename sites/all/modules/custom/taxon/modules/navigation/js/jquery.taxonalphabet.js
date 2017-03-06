(function( $ ) {
  
  $.fn.taxonAlphabet = function( options ) {
    
    var config = $.extend({
      groupSize: 6,
      changeCallback: $.noop
    }, options);
    
    
    return this.each(function() {
      var container = $(this);
      
      // Click callback.
      var clickNode = function() {
        var clicked = $(this);
        var parent = clicked.parent('li');

        if (parent.is('li.expanded')) {
          parent.removeClass('expanded').addClass('collapsed');
        } else if (parent.is('li.collapsed')) {
          parent.removeClass('collapsed').addClass('expanded');
        }

        if (parent.is('li.current')) {
          return;
        }

        $('li.current', container).removeClass('current');
        parent.addClass('current');
        
        config.changeCallback(clicked);
      }
      
      // Build the tree.
      var ul = $('<ul></ul>')
        .addClass('taxon-tree')
        .appendTo(container);
        
      var allSpan = $('<span>ALL</span>').click(clickNode);
      var allItem = $('<li></li>')
        .addClass('current no-children')
        .append(allSpan)
        .appendTo(ul);
      
      
      var offset = 0;
      var alphabet = $('abcdefghijklmnopqrstuvwxyz'.split(''));
      
      while (offset < alphabet.length) {
        
        var item = $('<li></li>').appendTo(ul);
        var slice = alphabet.slice(offset, offset += config.groupSize);
        
        if (slice.length == 1) {
          var label = slice.get(0).toUpperCase();
          var value = slice.get(0);
          
          var span = $('<span></span>')
            .html(label)
            .data('value', value)
            .click(clickNode);
          
          item.append(span).addClass('no-children');
                   
        } else {
          var label = slice.first().get(0).toUpperCase() + '-' + slice.last().get(0).toUpperCase();
          var value = slice.get().join(';');
          
          var span = $('<span></span>')
            .html(label)
            .data('value', value)
            .click(clickNode);
                              
          var childrenUl = $('<ul></ul>').addClass('taxon-tree')
          slice.each(function(index) {
            var childrenValue = this.toString();
            var childrenLabel = this.toString().toUpperCase();
            
            var childrenSpan = $('<span></span>')
              .html(childrenLabel)
              .data('value', childrenValue)
              .click(clickNode);
            
            var childrenItem = $('<li></li>')
              .append(childrenSpan)
              .addClass('no-children')
              .appendTo(childrenUl);
          });
          
          
          item.append(span, childrenUl).addClass('collapsed has-children');
        }
      }
    
    });
  }
  
})(jQuery);