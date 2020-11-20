# flowtimr
A simple Microsoft 365-Compatible Calendar overview that displays your current + next meetings in a clean way.

# Developing
While developing, you need a .env.local in the root directory of this project. It must contain
´´´
VUE_APP_GRAPH_CLIENT_ID=<MS_GRAPH_CLIENT_ID>
´´´
To get this client id, visit https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade/Overview/appId/7dad2b10-9cb1-4538-9095-dd034dd3dfba/objectId/f0c9bfef-f8cd-42f9-bee5-88b3122b1414/isMSAApp//defaultBlade/Overview/appSignInAudience/AzureADMyOrg/servicePrincipalCreated/true
