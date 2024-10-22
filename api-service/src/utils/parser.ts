import fs from "fs";
import yaml from "yaml";

export const readAndParseKubeYaml = (filePath: string, projectId: string) => {
  const fileContent = fs.readFileSync(filePath, "utf8");

  // ! we'll have multiple docs in same yaml file separated by '---' => so parse all docs
  const docs = yaml.parseAllDocuments(fileContent).map((doc) => {
    // ! yaml file will contain placeholder service-name => replace it with projectId
    const regex = new RegExp("service-name", "g");
    const docString = doc.toString().replace(regex, projectId);
    // console.log(
    //   `utils/k8s.ts:readAndParseKubeYaml: updated YAML doc: ${docString}`
    // );

    return yaml.parse(docString);
  });

  return docs;
};
