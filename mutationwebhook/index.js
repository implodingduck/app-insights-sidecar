const fs = require("fs");
const https = require("https");

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
            console.log(`hello world! ${body}`)
            res.writeHead(200, { "Content-Type": "application/json" });
            
            let resp = {
                "apiVersion": "admission.k8s.io/v1",
                "kind": "AdmissionReview",
                "response": {
                  "uid": JSON.parse(body).request.uid,
                  "allowed": true
                }
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