const appInsights = require("applicationinsights");

appInsights.setup(process.env.APPINSIGHTS_CONNECTION_STRING || process.env.APPLICATIONINSIGHTS_CONNECTION_STRING)
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

const client = appInsights.defaultClient;

const chokidar = require('chokidar');
const Tail = require('tail-file');
class Tail_To_Insights {
    constructor(path) {
        this.path = path;
        this.tail = new Tail(path, (line) =>{
            let traceEvent = {
                message: line, 
                properties: { 
                    path: path 
                }
            };

            console.log( JSON.stringify(traceEvent) );
            client.trackTrace(traceEvent);
        });
    }
}

const pathToWatch = '/var/log' || process.env.PATH_TO_WATCH

const filesBeingTailed = {}
chokidar.watch('/var/log', {
    persistent: true,
    followSymlinks: true
}).on('all', (event, path) => {
    console.log(event, path);
    if (event === 'add' || event === 'change'){
        if (filesBeingTailed[path] === undefined){
            console.log("yeah I should probably do something here")
            filesBeingTailed[path] = new Tail_To_Insights(path)
        }
    }
});

