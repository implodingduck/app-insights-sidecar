const appInsights = require("applicationinsights");

appInsights.defaultClient.commonProperties = {
    sidecar: true
};

appInsights.setup(process.env.APPINSIGHTS_CONNECTION_STRING)
    .setAutoDependencyCorrelation(false)
    .setAutoCollectRequests(false)
    .setAutoCollectPerformance(false, false)
    .setAutoCollectExceptions(false)
    .setAutoCollectDependencies(false)
    .setAutoCollectConsole(false)
    .setUseDiskRetryCaching(false)
    .setSendLiveMetrics(false)
    .setDistributedTracingMode(appInsights.DistributedTracingModes.AI)
    .start();

const chokidar = require('chokidar');

chokidar.watch('/var/log').on('all', (event, path) => {
    console.log(event, path);
});