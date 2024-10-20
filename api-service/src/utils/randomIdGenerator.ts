import { v4 as uuidv4 } from "uuid";

export const randomIdGenerator = (maxLength: number = -1) => {
  let id = uuidv4().replace(/-/g, "");
  if (maxLength === -1) {
    return id;
  }
  return id.substring(0, maxLength);
};
