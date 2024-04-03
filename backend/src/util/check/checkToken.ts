import fs from "node:fs/promises";
import jwt from "jsonwebtoken";

const getPrivateKey = (): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await fs.readFile("./src/private/private.jwt.key", "utf8");
      resolve(data);
    } catch (e) {
      reject(e);
    }
  });
};

let privateKey: string;

(async()=>{
  privateKey = await getPrivateKey();
})()

export default function IsValidToken(token: string): boolean {
  try {
    const decoded = jwt.verify(token, privateKey);
    return true;
  } catch (e) {
    return false
  }
}
