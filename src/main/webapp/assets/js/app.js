/*
  UniFlow JSP asset entry.
  Placeholder for small progressive-enhancement behaviors in the SSR migration.
*/
(function () {
  'use strict';

  window.addEventListener('DOMContentLoaded', function () {
    var role = window.__USER_ROLE || '';
    document.documentElement.setAttribute('data-user-role', role);
  });
})();
