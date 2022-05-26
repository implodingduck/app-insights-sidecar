#!/bin/bash
docker stop sampleapp
docker rm sampleapp
docker build -t sampleapp .
docker run --name sampleapp -d -p 8080:8080 sampleapp