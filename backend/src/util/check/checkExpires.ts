export default function isExpires(expired: Date) {
  if (expired.toISOString() > new Date().toISOString()) {
    return false;
  } else {
    return true;
  }
}
