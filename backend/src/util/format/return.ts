import { ReturnData } from "../../typings/endpoints";

export default function ReturnData({ status, message, data = null }: ReturnData) {
  return {
    status,
    message,
    data,
  };
}
