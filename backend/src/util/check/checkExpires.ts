export default function IsNotExpired(expired: Date) {
  if (expired.toISOString() > new Date().toISOString()) {
    return true; // not
  } else {
    return false; // yes
  }
}
