<?php
// $Id$

/**
 * @file
 * Default theme implementation for taxon navigation block.
 * 
 * Available variables:
 * - $prev_url: URL to the previous taxon in the hierarchy.
 * - $prev_name: Name of the previous taxon in the hierarchy.
 * - $next_url: URL to the next taxon in the hierarchy.
 * - $next_name: Name of the next taxon in the hierarchy.
 * - $tree: The children, siblings and parents of the current taxon
 *   as an unordered HTML list.
 * 
 * @see template_preprocess().
 * @see template_preprocess_taxon_navigation_block().
 */ 
?>
<?php if ($prev_url || $next_url): ?>
  <div class="taxon-links clearfix">
    <?php if ($prev_url): ?>
      <a href="<?php print $prev_url; ?>" class="taxon-previous" title="<?php print t('Go to @taxon', array('@taxon' => $prev_name)); ?>">‹ Previous</a>
    <?php endif; ?>
    <?php if ($next_url): ?>
      <a href="<?php print $next_url; ?>" class="taxon-next" title="<?php print t('Go to @taxon', array('@taxon' => $next_name)); ?>">Next ›</a>
    <?php endif; ?>
  </div>
<?php endif; ?>

<?php print $tree; ?>