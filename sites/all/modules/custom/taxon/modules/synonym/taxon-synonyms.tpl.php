<?php
// $Id$

/**
 * @file
 * Default theme implementation to display taxon synonyms.
 * 
 * Available variables:
 * - $synonyms: An array of synonyms to display.
 * 
 * Each $synonym in $synonyms contains:
 * - $synonym['synonym_name']: The name of the synonym.
 * - $synonym['synonym_author']: The author of the synonym.
 * 
 * @see template_preprocess().
 * @see template_preprocess_taxon_synonyms().
 */
?>
<div id="taxon-synonyms" class="taxon-content">
  <h2><?php print t('Synonym names'); ?></h2>
  
  <ul>
  <?php foreach ($synonyms as $synonym): ?>
    <li><em><?php print $synonym['synonym_name']; ?></em> <?php print $synonym['synonym_author']; ?></li>
  <?php endforeach; ?>
  </ul>
  
</div>