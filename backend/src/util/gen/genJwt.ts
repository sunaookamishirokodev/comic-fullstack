import fs from "fs/promises";
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

export default function getJWT({
  email,
  password,
}: {
  email: string;
  password: string;
}): string {
  const token = jwt.sign(
    {
      email,
      password,
    },
    privateKey,
    {
      expiresIn: "7d",
      audience: "client:shirokodev.site",
      issuer: "server:api.shirokodev.site",
    }
  );

  return token;
}
