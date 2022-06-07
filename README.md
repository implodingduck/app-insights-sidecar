# app-insights-sidecar
The purpose of this project is to inject pods with a side car that can monitor a log directory and send those logs to an Application Insights instance in Azure. This repo has 3 main parts. The first is the `mutationwebhook` which is used to inject the side car. The second is the `sidecar` itself which reads a log directory and send the logs into Application Insights. Finally the `sampleapp` which is just used to test things out.
## Setup
* Clone the repo
* Change directory to `./mutationwebhook/manifests`
* Run `init.sh`
* Update the generated `0-secrets.yaml` with the base64 encoded connection string to app insights found in the Azure Portal
* Run the YAML files in order with `kubectl apply -f <filename>`
* Go to the `./sampleapp/manifests` directory 
* Run the yaml files 
* Get the external IP from `kubectl get services`
* Hit the external IP in the browser
* Wait up to 5 min and check the Application Insights in Azure for logs

## Resources
* https://github.com/microsoft/Application-Insights-K8s-Codeless-Attach/releases
* https://azure.github.io/kube-labs/5-aks-appinsights.html#objective-of-the-lab