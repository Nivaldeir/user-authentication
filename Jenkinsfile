pipeline {
  agent any
  stages {
    stage("Build docker Image"){
      steps {
        script {
          dockerapp = docker.build("nivaldeir/user-autenticacao:${env.BUILD_ID}", '-f ./Dockerfile .')
        }
      }
    }
    stage("Push docker Image"){
      steps {
        script {
          docker.withRegistry('https://registry.hub.docker.com', 'dockerhub'){
            dockerapp.push("latest")
            dockerapp.push("${env.BUILD_ID}")
          }
        }
      }
    }
    stage("Deploy no Kubernetes"){
      environment {
        tag_version = "${env.BUILD_ID}"
      }
      steps {
        withKubeConfigs([credentialsId: 'kubeconfig']) {
          sh 'sed -i "s/{{TAG}}/$tag_version/g" ./k8s/deployment.yaml'
          sh 'kubectl apply -f ./k8s/deployment.yaml'
        }
      }
    }
  }
}