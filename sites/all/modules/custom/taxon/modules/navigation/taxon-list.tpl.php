<?php
// $Id$

/**
 * @file
 * Default theme implementation to display a list of taxa.
 * 
 * Available variables:
 * - $taxa: An array of taxa to display.
 * 
 * Each $taxon in $taxa contains:
 * - $taxon['name']: The name of the taxon.
 * - $taxon['link']: The URL to link the taxon.
 * - $taxon['image']: HTML to display a thumbnail of the taxon.
 * 
 * @see template_preprocess().
 * @see template_preprocess_taxon_list().
 */
?>
<div class="taxon-list">
  <table>
    <thead>
      <tr>
        <th class="taxon-image"><?php print t('Illustration'); ?></th>
        <th class="taxon-name"><?php print t('Taxon name'); ?></th>
      </tr>
    </thead>
    <tbody>
    <?php foreach ($taxa as $taxon): ?>
      <tr>
        <td class="taxon-image">
          <a href="<?php print $taxon['link']; ?>"><?php print $taxon['image']; ?></a>
        </td>
        <td class="taxon-name">
          <a href="<?php print $taxon['link']; ?>"><?php print $taxon['name']; ?></a>
        </td>
      </tr>
    <?php endforeach; ?>
    </tbody>
  </table>
</div>