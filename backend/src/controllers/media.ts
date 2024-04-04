import fs from "fs";
import genId from "../util/gen/genId";

export const uploadAvatarUser = async (data: Blob) => {
  const id = genId();
  const name = `${id}.${data.type.split("/")[1]}`;
  const path = `./public/${name}`;
  fs.writeFileSync(path, Buffer.from(await data.arrayBuffer()));
  return name
};

export const uploadBannerUser = async (data: Blob) => {
  const id = genId();
  const name = `${id}.${data.type.split("/")[1]}`;
  const path = `./public/${name}`;
  fs.writeFileSync(path, Buffer.from(await data.arrayBuffer()));
  return name
};

export const uploadChapter = async ({
  data,
}: {
  data: Blob;
}): Promise<string> => {
  const id = genId();
  const name = `${id}.${data.type.split("/")[1]}`;
  const path = `./public/${name}`;
  fs.writeFileSync(path, Buffer.from(await data.arrayBuffer()));
  return name
};
