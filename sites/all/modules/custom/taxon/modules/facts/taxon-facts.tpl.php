<?php
// $Id$ 

/**
 * @file
 * Default theme implementation for taxon facts.
 * 
 * Available variables:
 * - $facts An array with facts to display.
 *
 * Each $item in $facts contains:
 * - $field The field name of facts item.
 * - $value The value of the facts item.
 * 
 * @see template_preprocess()
 * @see template_preprocess_taxon_facts()
 */
?>
<div id="taxon-facts" class="taxon-content">
  <h2><?php print t('Description'); ?></h2>
  
<?php if ($facts): ?>
  <dl>
  <?php foreach ($facts as $item):  ?>
    <dt><?php print $item['field']; ?></dt>
    <dd><?php print $item['value']; ?></dd>
  <?php endforeach; ?>
  </dl>
<?php endif; ?>
  
</div>