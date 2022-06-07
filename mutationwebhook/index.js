const fs = require("fs");
const https = require("https");
const { Buffer } = require('node:buffer');
const rfc6902 = require('rfc6902')

let options;
const port = process.env.port || 8443;

console.log(`listening on port ${port}`, "");
try {
    options = {
        cert: fs.readFileSync("/ssl/cert.pem"),
        key: fs.readFileSync("/ssl/key.pem"),
    };
    console.log("loaded certificates from /ssl");
} catch {
    console.log("unable to load certs");
}

https.createServer(options, (req, res) => {
    console.log(`received request with url: ${req.url}, method: ${req.method}, content-type: ${req.headers["content-type"]}`);

    if (req.method === "POST" && req.headers["content-type"] === "application/json") {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString(); // convert Buffer to string
        });
        req.on("end", () => {
            const jsonBody = JSON.parse(body)
            let newJsonBody = JSON.parse(body)
            console.log(`hello world! ${body}`)
            console.log("----------")
            console.log(`Namespace: ${JSON.stringify(jsonBody.request.namespace)}`)
            console.log("----------")
            console.log(`Spec: ${JSON.stringify(jsonBody.request.object.spec)}`)
            console.log("----------")
            console.log(`Containers: ${JSON.stringify(jsonBody.request.object.spec.containers)}`)

            let addSideCar = true

            for(let c of jsonBody.request.object.spec.containers ){
                if (c.name === 'app-insights-sidecar'){
                    addSideCar = false
                }
            }
            let jsonPatch = null
            if (addSideCar){
                let sidecarJson = {
                    "name":"app-insights-sidecar",
                    "image":"ghcr.io/implodingduck/app-insights-sidecar:latest",
                    "env":[
                        {
                            "name":"APPINSIGHTS_CONNECTION_STRING",
                            "value": process.env.APPINSIGHTS_CONNECTION_STRING
                        }
                    ],
                    "resources":{},
                    "volumeMounts":[
                        {
                            "name":"var-logs",
                            "mountPath":"/var/log"
                        }
                    ],
                    "imagePullPolicy":"Always"
                }
    
                console.log(`Sidecar Json: ${JSON.stringify(sidecarJson)}`)
                newJsonBody.request.object.spec.containers.push(sidecarJson)

                console.log(`Post Containers: ${JSON.stringify(newJsonBody.request.object.spec.containers)}`)

                jsonPatch = rfc6902.createPatch(jsonBody.request.object, newJsonBody.request.object)
                console.log(`jsonPatch: ${JSON.stringify(jsonPatch)}`)
            }
            
            res.writeHead(200, { "Content-Type": "application/json" });
            
            let resp = {
                "apiVersion": "admission.k8s.io/v1",
                "kind": "AdmissionReview",
                "response": {
                  "uid": JSON.parse(body).request.uid,
                  "allowed": true
                }
            }
            if (jsonPatch){
                resp.response.patchType = "JSONPatch"
                resp.response.patch = Buffer.from(JSON.stringify(jsonPatch)).toString('base64')
            }
            console.log(`My resp: ${JSON.stringify(resp)}`)
            res.end(JSON.stringify(resp));
        });
    } else {
        console.log("unaccepable method, returning 404");
        res.writeHead(404);
        res.end();
    }

}).listen(port);