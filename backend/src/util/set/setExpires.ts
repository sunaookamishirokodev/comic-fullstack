import ms from "ms";
import { addMilliseconds } from "date-fns";

export default function setExpires(time: string) {
  const milisecondsTime = ms(time);

  const expiresAt = addMilliseconds(new Date(), milisecondsTime)

  return expiresAt
}
