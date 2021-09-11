#!/usr/bin/env zx

fs = require('fs');
let JARFILE="akka_http.jar"
let SCALA_VERSION="2.13"
let MAINCLASS="part3_highlevelhttp.HigLevelHttp"
let DOCKERTAG="onomoly/akka_http_training:0.0.1"
let script_path = path.dirname(__filename);
let projectPath=script_path.split("/").slice(0,-1).join("/");
let dockerDirPath=`${projectPath}/docker`
let dockerPath=`${dockerDirPath}/Dockerfile`
let jarPath=`${projectPath}/target/scala-${SCALA_VERSION}/${JARFILE}`

$`mkdir -p ${dockerDirPath}`
$`cp ${jarPath} ${dockerDirPath}`

let dockerfileContent=`
FROM openjdk:8
RUN mkdir -p /app
WORKDIR /app
COPY ${JARFILE} . /app
EXPOSE 8080
CMD ["java", "-cp", "/app/${JARFILE}", "${MAINCLASS}"]
`

fs.writeFile(dockerPath, dockerfileContent, function (err) {
  if (err) return console.log(err);
});

$`cd ${dockerDirPath} && docker build -t ${DOCKERTAG} . `
