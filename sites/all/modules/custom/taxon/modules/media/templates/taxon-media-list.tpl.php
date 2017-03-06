<?php
// $Id$

/**
 * @file
 * Default theme implementation for taxon media lists.
 * 
 * Available variables:
 * - $media: An array with media items to display.
 *
 * Each $media_item in $media contains:
 * - $image: Clickable thumbnail to display (processed by theme_taxon_media_thumbnail)
 * - $metadata: Metadata to display (processed by taxon-media-metadata.tpl.php)
 *
 * @see template_preprocess()
 * @see template_preprocess_taxon_media_list()
 */
?>
<ul>
<?php foreach ($media as $media_item): ?>
  <li>
    <div class="taxon-image"><?php print $media_item['image']; ?></div>
    <?php print $media_item['metadata']; ?>
  </li>
<?php endforeach; ?>
</ul>
