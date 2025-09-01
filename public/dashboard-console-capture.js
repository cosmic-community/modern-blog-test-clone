(function() {
  // Only activate when in iframe (dashboard preview)
  if (window.self === window.top) return;
  
  const logs = [];
  const MAX_LOGS = 500;
  
  // Store original console methods
  const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
    info: console.info,
    debug: console.debug
  };
  
  // Helper function to safely serialize objects
  function serializeArg(arg) {
    if (typeof arg === 'object' && arg !== null) {
      try {
        return JSON.stringify(arg, function(key, value) {
          if (typeof value === 'function') return '[Function]';
          if (value instanceof Error) return value.toString();
          return value;
        }, 2);
      } catch (e) {
        return '[Object]';
      }
    }
    return String(arg);
  }
  
  // Capture console logs
  function captureLog(level, args) {
    const timestamp = new Date().toISOString();
    const message = Array.from(args).map(serializeArg).join(' ');
    
    const logEntry = {
      timestamp,
      level,
      message,
      url: window.location.href
    };
    
    logs.push(logEntry);
    
    // Maintain max logs limit
    if (logs.length > MAX_LOGS) {
      logs.shift();
    }
    
    // Send to parent dashboard
    try {
      window.parent.postMessage({
        type: 'console-log',
        log: logEntry
      }, '*');
    } catch (e) {
      // Silent fail if postMessage fails
    }
    
    // Call original console method
    originalConsole[level].apply(console, args);
  }
  
  // Override console methods
  console.log = function() { captureLog('log', arguments); };
  console.warn = function() { captureLog('warn', arguments); };
  console.error = function() { captureLog('error', arguments); };
  console.info = function() { captureLog('info', arguments); };
  console.debug = function() { captureLog('debug', arguments); };
  
  // Capture unhandled errors
  window.addEventListener('error', function(event) {
    captureLog('error', [`Uncaught Error: ${event.error ? event.error.toString() : event.message}`]);
  });
  
  // Capture unhandled promise rejections
  window.addEventListener('unhandledrejection', function(event) {
    captureLog('error', [`Unhandled Promise Rejection: ${event.reason}`]);
  });
  
  // Send ready message to parent
  function sendReady() {
    try {
      window.parent.postMessage({
        type: 'console-capture-ready',
        url: window.location.href,
        timestamp: new Date().toISOString()
      }, '*');
      
      // Also send initial route information
      sendRouteChange();
    } catch (e) {
      // Silent fail
    }
  }
  
  // Send route change information
  function sendRouteChange() {
    try {
      window.parent.postMessage({
        type: 'route-change',
        route: {
          pathname: window.location.pathname,
          search: window.location.search,
          hash: window.location.hash,
          href: window.location.href
        },
        timestamp: new Date().toISOString()
      }, '*');
    } catch (e) {
      // Silent fail
    }
  }
  
  // Monitor route changes for SPA navigation
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;
  
  history.pushState = function() {
    originalPushState.apply(history, arguments);
    sendRouteChange();
  };
  
  history.replaceState = function() {
    originalReplaceState.apply(history, arguments);
    sendRouteChange();
  };
  
  // Listen for popstate (back/forward navigation)
  window.addEventListener('popstate', sendRouteChange);
  
  // Listen for hash changes
  window.addEventListener('hashchange', sendRouteChange);
  
  // Send ready message when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', sendReady);
  } else {
    // DOM already loaded
    sendReady();
  }
  
  // Also send ready on window load as backup
  window.addEventListener('load', sendReady);
})();