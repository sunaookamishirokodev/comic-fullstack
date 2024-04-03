import prisma from "../db";
import { addHours, isPast } from "date-fns";
import MeiliSearch from "meilisearch";

const SetTime = (): Date => {
  return addHours(new Date(), 1);
};

let time = new Date();

const client = new MeiliSearch({
  host: "http://127.0.0.1:7700",
  apiKey: process.env.MEILISEARCH_MASTERKEY,
});

const index = client.index("comics");

export default async function SearchEngine(searchString: string) {
  if (isPast(time)) {
    time = SetTime();
    await index.deleteAllDocuments();
    const docs = await prisma.comic.findMany({
      where: {
        verify: true
      },
      select: {
        name: true,
        description: true,
        genre: true,
        thumbnail: true,
        id: true,
      },
    });

    await index.addDocuments(docs);

    const tasks = await index.getTasks();
    if (tasks) {
      await client.deleteTasks({
        uids: tasks.results.map((r) => {
          return r.uid;
        }),
      });
    }

    await SearchEngine(searchString);
  }
  const result = await index.search(searchString, {
    // attributesToHighlight: ["name", "genre", "description"],
    attributesToSearchOn: ["name", "genre", "description"],
  });
  return result.hits;
}
