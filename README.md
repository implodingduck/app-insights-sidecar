# app-insights-sidecar
* Go to https://github.com/microsoft/Application-Insights-K8s-Codeless-Attach/releases and download the latest tgz release. At the time of writing it is [appmonitoring-0.9.2.tgz](https://github.com/microsoft/Application-Insights-K8s-Codeless-Attach/releases/download/0.9.2/appmonitoring-0.9.2.tgz)
* Run `Application-Insights-K8s-Codeless-Attach/init.sh` 
* Update `values.yaml` adding in App Insights instrumentation key
* Download and modify: https://raw.githubusercontent.com/microsoft/Application-Insights-K8s-Codeless-Attach/master/src/extras/container-azm-ms-agentconfig.yaml
* `kubectl apply -f container-azm-ms-agentconfig.yaml`
* Run `helm upgrade codeless-ai ./appmonitoring-0.9.2.tgz -f values.yaml --install --set namespaces={} --set namespaces[0].target=default`
* If RBAC: 
    * `kubectl apply -f namespace-admin.yaml`
    * `kubectl create clusterrolebinding appmonitoring-view --clusterrole view --user system:serviceaccount:kube-system:app-monitoring-webhook`
    * `kubectl create rolebinding appmonitoring-default-admin --clusterrole namespace-admin --serviceaccount=kube-system:app-monitoring-webhook --namespace=default`
## Resources
* https://github.com/microsoft/Application-Insights-K8s-Codeless-Attach/releases
* https://azure.github.io/kube-labs/5-aks-appinsights.html#objective-of-the-lab