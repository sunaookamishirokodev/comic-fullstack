import { Role } from "@prisma/client";
import prisma from "../../db";

export default async function hasRole({ id, role }: { id: string; role: Role[] }) {
  const user = await prisma.author.findUnique({
    where: {
      id,
    },
    select: {
      roles: true,
    },
  });

  if (role.every((e) => user?.roles.includes(e))) {
    return true;
  } else {
    return false;
  }
}
