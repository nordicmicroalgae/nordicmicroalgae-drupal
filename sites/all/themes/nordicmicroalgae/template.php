<?php

/**
 * Override or insert variables into the html template.
 */
function nordicmicroalgae_preprocess_html(&$variables) {
  // Remove page title from the front page, keeping just site name and slogan.
  if ($variables['is_front']) {
    unset($variables['head_title_array']['title']);
    $variables['head_title'] = implode(' | ', $variables['head_title_array']);
  }  
}

/**
 * Override or insert variables into the page template.
 */
function nordicmicroalgae_preprocess_page(&$variables) {
  global $user, $base_path;
  
  $variables['partners_images'] = $base_path . drupal_get_path('theme', 'nordicmicroalgae') . '/partners';
  
  // Add user menu items.
  $user_menu = array();
  if (!$user->uid) {
    // Add destination redirect parameter on all pages except front page 
    // and user pages (registration, log in etc).
    if (!$variables['is_front'] && !(arg(0) == 'user')) {
      $user_menu['login'] = array('title' => t('Log in'), 'href' => 'user/login', 'query' => drupal_get_destination());
    }
    else {
      $user_menu['login'] = array('title' => t('Log in'), 'href' => 'user/login');
    }
    
    $user_menu['register'] = array('title' => t('Register'), 'href' => 'user/register');
  }
  else {
    $user_menu['account'] = array('title' => t('My account'), 'href' => 'user');
    $user_menu['logout'] = array('title' => t('Log out'), 'href' => 'user/logout');
  }
  $variables['user_menu'] = $user_menu;
}
