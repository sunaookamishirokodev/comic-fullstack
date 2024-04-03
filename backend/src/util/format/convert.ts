import { config } from "../../config";

export function convertUrlToPath(url: String) {
  return "./" + url.split(config.baseurl)[1];
}

export function convertPathToUrl(path: string) {
  console.log(config.baseurl + path.split("./")[1]);
  return config.baseurl + "/" + path.split("./")[1];
}

// i convert it with my domain to save into my database:v
// but i dont know what happen when i change domain:v
// what is solution
