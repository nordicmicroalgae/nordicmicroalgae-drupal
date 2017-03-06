<?php
// $Id$

/**
 * @file
 * Default implementation for taxon classification.
 * 
 * @todo Document available template variables.
 * 
 * @see template_preprocess()
 * @see template_preprocess_taxon_classification()
 */ 
?>
<ul class="taxon-classification">
<?php foreach ($classification as $rank => $name): ?>
  <li><strong><?php print $rank; ?></strong> <?php print render($name); ?></li>
<?php endforeach; ?>
</ul>