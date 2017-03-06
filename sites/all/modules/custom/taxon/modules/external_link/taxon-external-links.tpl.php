<?php
// $Id$

/**
 * @file
 * Default theme implementation to display taxon external links.
 * 
 * Available variables:
 * - $external_links: An array of external links to display.
 * 
 * Each $external_links in $external_links contains:
 * TODO
 * 
 * @see template_preprocess().
 * @see template_preprocess_taxon_external_links().
 */
?>
<div id="taxon-external-links" class="taxon-content clearfix">
  <h2><?php print t('External links'); ?></h2>
  
  <ul>
  <?php foreach ($external_links as $external_link): ?>
    <li class="<?php print $external_link['provider_class']; ?>">
      <a href="<?php print $external_link['link']; ?>"><?php print $external_link['provider']; ?></a>
    </li>
  <?php endforeach; ?>
  </ul>
  
</div>