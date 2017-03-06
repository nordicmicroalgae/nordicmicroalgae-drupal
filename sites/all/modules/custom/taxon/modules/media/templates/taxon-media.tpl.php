<?php
// $Id$

/**
 * @file
 * Default theme implementation for taxon media.
 * 
 * Available variables:
 * - $image: Image or video to display (processed by theme_image or theme_video depending on media type).
 * - $original_link: Link to the media in original size, if available.
 * - $title: Title of the media, if available.
 * - $caption: Caption text to display, if available.
 * - $photographer: Photographer/artist name, if available.
 * - $metadata: Metadata for the media to display (processed by taxon-media-metadata.tpl.php).
 * - $thumbnails: Thumbnails for the current taxon (processed by taxon-media-list.tpl.php). 
 * 
 * Other variables:
 * - $media: An array with unprocessed media items and data.
 *
 * @see template_preprocess().
 * @see template_preprocess_taxon_media().
 */
?>
<div id="taxon-media" class="taxon-content">
  <?php print $image; ?>
  
<?php if ($original_link): ?>
  <p><?php print $original_link; ?></p>
<?php endif; ?>
  
<?php if ($title): ?>
  <h3><?php print $title; ?></h3>
<?php endif; ?>  

<?php if ($caption): ?>
  <p><?php print $caption; ?></p>
<?php endif; ?>

<?php if ($photographer): ?>
  <p>Photographer/artist <?php print $photographer; ?></p>
<?php endif; ?>
  
<?php if ($metadata): ?>
  <div id="taxon-media-metadata" class="clearfix">
    <h4><?php print t('Additional image information'); ?></h4>
    <?php print $metadata; ?>
  </div>
<?php endif; ?>
  
<?php if ($thumbnails): ?>
  <div id="taxon-media-thumbnails" class="clearfix">
  <?php print $thumbnails; ?>
  </div>
<?php endif; ?>
  
</div>