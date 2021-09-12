#!/usr/bin/env zx

var DOCKERTAG="onomoly/akka_http_training:0.0.1";

function build(args) {
    fs = require('fs');
    let JARFILE="akka_http.jar";
    let SCALA_VERSION="2.13";
    let MAINCLASS="part3_highlevelhttp.HigLevelHttp";
    let script_path = path.dirname(__filename);
    let projectPath=script_path.split("/").slice(0,-1).join("/");
    let dockerDirPath=`${projectPath}/docker`;
    let dockerPath=`${dockerDirPath}/Dockerfile`;
    let jarPath=`${projectPath}/target/scala-${SCALA_VERSION}/${JARFILE}`;

    $`mkdir -p ${dockerDirPath}`;
    $`cp ${jarPath} ${dockerDirPath}`;

    let dockerfileContent=`
    FROM openjdk:8
    RUN mkdir -p /app
    WORKDIR /app
    COPY ${JARFILE} . /app
    EXPOSE 8080
    CMD ["java", "-cp", "/app/${JARFILE}", "${MAINCLASS}"]
    `;

    fs.writeFile(dockerPath, dockerfileContent, function (err) {
      if (err) return console.log(err);
    });

    $`cd ${dockerDirPath} && docker build -t ${DOCKERTAG} . `;
}


function run_docker(args){
    let container_name=args[0];
    if (container_name==undefined || container_name==null || container_name.trim()==""){
        console.log(`usage: zx ${process.argv[2]} run_docker <docker_container_name> `);
        return;
    }
    $`docker run --rm -p 8080:8080 --name ${container_name} ${DOCKERTAG}`
}


if (process.argv.length<4){
    console.log(`usage: zx ${process.argv[2]} [build|run_docker|kube_deploy] `);
    return;
} 

command=process.argv[3];
args=process.argv.slice(4);
if (command=="build")
    build(args);
if (command=="run_docker")
    run_docker(args);


