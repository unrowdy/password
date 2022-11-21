# Password Generator

[![Netlify Status](https://api.netlify.com/api/v1/badges/823d779d-89a8-4c94-aef5-92e42f778140/deploy-status)](https://app.netlify.com/sites/unrowdy-password/deploys)

To generate passwords that will actually meet the requirements of the sites you are generating them for, without having to manually tweak them.

![screenshot](screenshot.png)

## Features

  * Different types of characters are guaranteed, not "allowed"
  * No pointless options like "allow digits" or "allow uppercase"
  * You can copy/paste a list of allowed special characters for sites that require that
  * URL safe option in case a site really can't handle anything complicated
  * Passwords generated locally using the Web Crypto API

## Todo

  * PWA things
  * Plausible snippet
  * Update screenshot
  * Feather icon license?
  * Move csp to http header?
  * Reminder to update csp hash (via Chrome console message) when changing inline js
  * settings in localstorage - and option to save character sets?
  * copy complete indicator
  * intentionally? missing space and backslash in character list
