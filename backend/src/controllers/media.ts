import fs from "fs";
import genId from "../util/gen/genId";
import { config } from "../config";
import { convertPathToUrl } from "../util/format/convert";

export const uploadAvatarUser = async (data: Blob) => {
  const id = genId();
  const name = `${id}.${data.type.split("/")[1]}`;
  const path = `./public/${name}`;
  fs.writeFileSync(path, Buffer.from(await data.arrayBuffer()));
  return convertPathToUrl(path);
};

export const uploadBannerUser = async (data: Blob) => {
  const id = genId();
  const name = `${id}.${data.type.split("/")[1]}`;
  const path = `./public/${name}`;
  fs.writeFileSync(path, Buffer.from(await data.arrayBuffer()));
  return convertPathToUrl(path);
};

export const uploadChapter = async ({
  data,
  comicId,
  chapterId,
}: {
  data: Blob;
  comicId: string;
  chapterId: string;
}): Promise<string> => {
  const id = genId();
  const name = `${id}.${data.type.split("/")[1]}`;
  const path = `./public/${name}`;
  fs.writeFileSync(path, Buffer.from(await data.arrayBuffer()));
  return convertPathToUrl(path);
};
