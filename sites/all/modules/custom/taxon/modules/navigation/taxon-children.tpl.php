<?php
// $Id$

/**
 * @file
 * Default theme implementation to display taxon children.
 * 
 * Available variables:
 * - $children: The children to display (processed by taxon-list.tpl.php)
 * 
 * @see template_preprocess().
 * @see template_preprocess_taxon_children().
 */
?>
<div id="taxon-children" class="taxon-content">
  <h2><?php print t('Subordinate taxa'); ?></h2>
  <?php print $children; ?>
</div>