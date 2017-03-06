<?php
// $Id$

/**
 * @file
 * Default theme implementation to display a list for managing taxon media.
 * 
 * Available variables:
 * - $media: An array of media to display.
 * 
 * Each $media_item in $media contains:
 * - $media_item['media_id']: The media_id.
 * - $media_item['image']: Image to display (processed by theme_image).
 * - $media_item['links']: Links for managing the item (processed by theme_links).
 * 
 * @see template_preprocess().
 * @see template_preprocess_taxon_media_manage().
 */
?>
<ul id="taxon-media-manage-list" class="clearfix">
<?php foreach ($media as $media_item): ?>
  
  <li>
    <span><?php print $media_item['media_id']; ?></span>
    <div><?php print $media_item['image']; ?></div>
    
    <?php print $media_item['links']; ?>
  </li>
  
<?php endforeach; ?>
</ul>