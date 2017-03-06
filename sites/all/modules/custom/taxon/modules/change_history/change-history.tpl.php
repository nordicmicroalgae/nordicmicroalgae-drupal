<?php
// $Id$

/**
 * @file
 * Default theme implementation to display change history.
 * 
 * Available variables:
 * - $change_history: An array of changes to display.
 * 
 * Each $change in $change_history contains:
 * - $change['timestamp']: Date and time when the change was made.
 * - $change['user_name']: Name of the user that made the change.
 * - $change['description']: Text describing the change.
 * 
 * @see template_preprocess().
 * @see template_preprocess_change_history().
 */
?>
<div id="change-history" class="taxon-content">
  <h2><?php print t('Change History'); ?></h2>
  
  <ul>
  <?php foreach ($change_history as $change): ?>
    <li>
      <span><?php print $change['timestamp']; ?></span>
      <strong><?php print $change['user_name']; ?></strong>
      - <?php print $change['description']; ?>
    </li>
  <?php endforeach; ?>
  </ul>
  
</div>