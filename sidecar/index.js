const appInsights = require("applicationinsights");



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

appInsights.defaultClient.commonProperties = {
    sidecar: true
};
const chokidar = require('chokidar');

const filesBeingTailed = {}
chokidar.watch('/var/log', {
    persistent: true,
    followSymlinks: true
}).on('all', (event, path) => {
    console.log(event, path);
    if (event === 'add' || event === 'change'){
        if (filesBeingTailed[path] === undefined){
            console.log("yeah I should probably do something here")
            filesBeingTailed[path] = "TBD"
        }
    }
});

