<?php

class NordicMicroalgaeClient {
    
  static $api_url;
  
  static $allowed_hosts = array(
    'nordicmicroalgae.org',
    'beta.nordicmicroalgae.org',
    'test.nordicmicroalgae.org',
    'nordicmicroalgae.dev',
  );
  
  function __construct() {    
    if (isset($_SERVER['HTTP_HOST']) && in_array($_SERVER['HTTP_HOST'], self::$allowed_hosts)) {
      self::$api_url = 'http://api.' . $_SERVER['HTTP_HOST'];
    } else {
      self::$api_url = 'http://api.nordicmicroalgae.org';
    }    
  }
  
  function load($name) {
    return $this->get($this->path('taxa', $name));
  }
  
  function classification($name) {
    return $this->get($this->path('taxa', $name, 'classification'));
  }
  
  function parent($name) {
    return $this->get($this->path('taxa', $name, 'parent'));
  }
  
  function children($name) {
    return $this->get($this->path('taxa', $name, 'children'));
  }
  
  function facts($name) {
    return $this->get($this->path('taxa', $name, 'facts'));
  }
  
  function media($name) {
    return $this->get($this->path('taxa', $name, 'media'));
  }
  
  function settings($key = null) {
    if ($key === null) {
      return $this->get($this->path('settings'));
    } else {
      return $this->get($this->path('settings', $key));
    }
  }
  
  function taxa(Array $params = array()) {
    return $this->get($this->path('taxa'), $params);
  }
  
  protected function get($path, array $params = array()) {
    $url = self::$api_url . '/' . $path;
    
    if (!empty($params)) {
      $url .= '?' . http_build_query($params);
    }

    $response = new stdClass();
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_HEADER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response->body = curl_exec($ch);
    $response->code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    
    $curl_error = curl_error($ch);
    curl_close($ch);
    
    if ($response->body === false) {
      throw new NordicMicroalgaeClientException('An error occurred during request (' . $url . '). cURL error: ' . $curl_error);
    }
    
    if ($response->code != 200) {
      throw new NordicMicroalgaeClientException('An error occurred during request (' . $url . '). Status code: ' . $response->code);
    }
    
    $data = json_decode($response->body, true);
    return $data;
  }
  
  protected function path() {
    $parts = array_map('rawurlencode', func_get_args());
    return strtolower(implode('/', $parts)) . '.json';
  }
}

class NordicMicroalgaeClientException extends Exception {}