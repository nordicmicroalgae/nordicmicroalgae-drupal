<?php
// $Id$ 

/**
 * @file
 * Default theme implementation for HELCOM PEG facts.
 * 
 * Available variables:
 * - $geometric_shape_image: Image describing the geometric shape.
 * - $species: An array with headers as keys and content as values.
 * - $size_classes: An array with headers as keys and arrays with values for each size class as values.
 * 
 * Other variables:
 * - $facts_peg Array with HELCOM PEG data. Contains data that may not be safe to output directly.
 * 
 * @see template_preprocess()
 * @see template_preprocess_taxon_facts_peg()
 */
?>
<div id="taxon-facts-peg" class="taxon-content">
  <h2><?php print t('Biovolumes'); ?></h2>
  
  <table>
    <tbody>
    <?php foreach ($species as $header => $value): ?>
    <tr>
      <th><?php print $header; ?></th>
      <td><?php print $value; ?></td>
    </tr>
    <?php endforeach; ?>
    </tbody>
  </table>
  
  <table>
    <tbody>
    <?php foreach ($size_classes as $header => $size_class): ?>
    <tr>
      <th><?php print $header; ?></th>
      <?php foreach ($size_class as $column): ?>
      <td><?php print $column; ?></td>
      <?php endforeach; ?>
    </tr>
    <?php endforeach; ?>
    </tbody>
  </table>
  
  <h3>Source</h3>
  <p><?php print $source; ?></p>
  
</div>
