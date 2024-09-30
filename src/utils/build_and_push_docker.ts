const { exec } = require("child_process");
const util = require("util");

const execPromise = util.promisify(exec);

const imageName = "user-authentication";
const tag = "latest";
const repo = "nivaldeir";

const buildImage = async () => {
  try {
    console.log("Construindo a imagem Docker...");
    await execPromise(`docker build -t ${imageName}:${tag} .`);
    console.log("Imagem Docker construída com sucesso.");

    console.log("Fazendo o push da imagem para o repositório...");
    await execPromise(
      `docker tag ${imageName}:${tag} ${repo}/${imageName}:${tag}`
    );
    await execPromise(`docker push ${repo}/${imageName}:${tag}`);
    console.log("Push da imagem realizado com sucesso.");
  } catch (error: any) {
    console.error(
      "Erro ao construir ou fazer o push da imagem Docker:",
      error.message
    );
  }
};

buildImage();
