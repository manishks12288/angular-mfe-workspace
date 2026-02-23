const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  name: 'host',

  remotes: {
    "products": "http://localhost:4201/remoteEntry.json",
    "orders": "http://localhost:4202/remoteEntry.json",
    "users": "http://localhost:4203/remoteEntry.json",
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: false, requiredVersion: 'auto' }),
  },

  skip: [
    'rxjs/ajax',
    'rxjs/fetch',
    'rxjs/testing',
    'rxjs/webSocket',
    // Add further packages you don't need at runtime
  ],

  // Ensure NgRx is shared as singleton
    '@ngrx/store': {
      singleton: true,
      strictVersion: true,
      requiredVersion: 'auto'
    },
    '@ngrx/effects': {
      singleton: true,
      strictVersion: true,
      requiredVersion: 'auto'
    },
    '@ngrx/store-devtools': {
      singleton: true,
      strictVersion: true,
      requiredVersion: 'auto'
    },

  // Please read our FAQ about sharing libs:
  // https://shorturl.at/jmzH0

  features: {
    // New feature for more performance and avoiding
    // issues with node libs. Comment this out to
    // get the traditional behavior:
    ignoreUnusedDeps: true
  }
});
