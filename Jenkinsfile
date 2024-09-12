pipeline {
  agent any
  stages {
    stage("Build docker Image"){
      steps {
        script {
          dockerapp = docker.build("nivaldeir/user-autenticacao:v1", '-f ./Dockerfile .')
        }
      }
    }
    stage("Push docker Image"){
      steps {
        script {
          docker.wothRegistry('https://registry.hub.docker.com', 'dockerhub'){
            dockerapp.push("latest")
            dockerapp.push("v1")
          }
        }
      }
    }
    stage("Deploy no Kubernetes"){
      steps {
        sh "echo 'Deploy no Kubernetes'"
      }
    }
  }
}