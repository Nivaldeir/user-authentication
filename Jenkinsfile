pipeline {
  agent any
  stages {
    stage("Build docker Image"){
      steps {
        script{
          dockerapp = docker.build("nivaldeir/user-autenticacao:v1", '-f ./Dockerfile')
          
        }
      }
    }
    stage("Push docker Image"){
      steps {
        sh "echo 'Envio de imagem'"
      }
    }
    stage("Deploy no Kubernetes"){
      steps {
        sh "echo 'Deploy no Kubernetes'"
      }
    }
  }
}