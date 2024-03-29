![Cover Art](cover.png?raw=true "Cover Art")

# flowtimr
A simple Microsoft 365-Compatible Calendar overview that displays your current + next meetings in a clean way.

# Development

## Configuration
Install netlify cli `npm install netlify-cli -g` and run `netlify link` to link it to your site.
While developing, you need a `.env.local`-file in the root directory of this project. It must contain

```
# Microsoft Graph API
VUE_APP_GRAPH_CLIENT_ID=xxx

# Firebase
VUE_APP_FIREBASE_API_KEY=xxx
VUE_APP_FIREBASE_AUTH_DOMAIN=xxx.firebaseapp.com
VUE_APP_FIREBASE_PROJECT_ID=xxx
VUE_APP_FIREBASE_APP_ID=xxx

# Netlify Functions
VUE_APP_NETLIFY_FUNCTIONS_BASE_URL=https://xxx.netlify.app/.netlify/functions/

# Microsoft OAuth
MS_OAUTH2_CLIENT_ID=xxx
MS_OAUTH2_CLIENT_SECRET=xxx

# Firebase Admin
FIREBASE_CONFIG={xxx: xxx}
```

- To get the Microsoft Graph Client ID, visit https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps
- To get all other Firebase IDs, visit https://console.firebase.google.com/project/YOUR_APP_ID/settings/general/
- To get Netlify Functions Base URL: https://app.netlify.com/
