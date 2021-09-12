#!/usr/bin/env node
import {$}  from 'zx';
import Crypto from 'crypto';
import {tmpdir} from 'os';
//import * as path from 'path';
import * as fs from 'fs';

const path = require('path');


var DOCKERTAG="onomoly/akka_http_training:0.0.1";
let JARFILE="akka_http.jar";
let SCALA_VERSION="2.13";
let MAINCLASS="part3_highlevelhttp.HigLevelHttp";
let script_path = path.dirname(__filename);
let projectPath=script_path.split("/").slice(0,-1).join("/");
let dockerDirPath=`${projectPath}/docker`;
let dockerPath=`${dockerDirPath}/Dockerfile`;
let jarPath=`${projectPath}/target/scala-${SCALA_VERSION}/${JARFILE}`;



    
function tmpFilePath() {
    let path_ = tmpdir()+ "/" + `archive.${Crypto.randomBytes(6).readUIntLE(0,6).toString(36)}`;
    return path_
}

function sh(cmd:string){
    let cmd_str = "eval $(minikube -p minikube docker-env) && " + cmd;
    console.log("cmd_str", cmd_str);
    $`eval $(minikube -p minikube docker-env) && ${cmd}`;
}

function build(args:string[]) {
    console.log("build", args);

    $`mkdir -p ${dockerDirPath}`;
    $`cp ${jarPath} ${dockerDirPath}`;

let dockerfileContent=`
FROM openjdk:8
RUN mkdir -p /app
WORKDIR /app
COPY ${JARFILE}  /app
EXPOSE 8080
CMD ["java", "-cp", "/app/${JARFILE}", "${MAINCLASS}"]
`;

    fs.writeFile(dockerPath, dockerfileContent, function (err:any) {
      if (err) return console.log(err);
    });

    $`eval $(minikube -p minikube docker-env) && cd ${dockerDirPath} && docker build -t ${DOCKERTAG} .`;
}


function run_docker(args:any){
    let container_name=args[0];
    if (container_name==undefined || container_name==null || container_name.trim()==""){
        console.log(`usage: zx ${process.argv[2]} run_docker <docker_container_name> `);
        return;
    }
    sh(`docker run --rm -p 8080:8080 --name ${container_name} ${DOCKERTAG}`);
}


function kube_deploy(args:any){

let template = `
apiVersion: apps/v1
kind: Deployment
metadata:
  name: akka-http-test
  namespace: test
  labels:
    app: akka-http-test
spec:
  replicas: 1
  selector:
    matchLabels:
      app: akka-http-test
  template:
    metadata:
      labels:
        app: akka-http-test
    spec:
      containers:
      - name: akka-http-test
        image: onomoly/akka_http_training:0.0.1
        imagePullPolicy: Never
        env:
        - name: APP_LIB_DIR
          value: "./lib"
        ports:
        - containerPort: 8080
          name: akka-http-test
`;

    let tempFilePath = tmpFilePath();
    fs.writeFile(tempFilePath, template, function (err:any) {
      if (err) return console.log(err);
    });

    $`eval $(minikube -p minikube docker-env) && cd ${dockerDirPath} && kubectl apply -f ${tempFilePath} -n test`;
}

function run(){
    console.log(process.argv);
    if (process.argv.length<3){
        console.log(`usage: ts-node ${process.argv[1]} [build|run_docker|kube_deploy] `);
        return;
    } 

    let command=process.argv[2];
    let args=process.argv.slice(3);
    if (command=="build")
        build(args);
    if (command=="run_docker")
        run_docker(args);
    if (command=="kube_deploy")
        kube_deploy(args);

}


run();
