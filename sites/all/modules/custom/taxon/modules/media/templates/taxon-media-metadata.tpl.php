<?php
// $Id$

/**
 * @file
 * Default theme implementation for taxon media metadata.
 * 
 * Available variables:
 * - $metadata: An array with metadata to display.
 *
 * Each $item in $metadata contains: 
 * - $field: The field name of the metadata item.
 * - $value: The value of the metadata item.
 * 
 * @see template_preprocess()
 * @see template_preprocess_taxon_media_metadata()
 * 
 */
?>
<?php if ($metadata): ?>
    
<dl>
<?php foreach ($metadata as $item): ?>
  <dt><?php print $item['field']; ?></dt>
  <dd><?php print $item['value']; ?></dd>
<?php endforeach; ?>
</dl>

<?php endif; ?>
