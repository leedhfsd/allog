import { pbkdf2Sync, randomBytes } from "crypto";

export function notAllowedStringCheck(str: string) {
  const regex = /[^a-zA-Z0-9{}[\]\\/?.,;:|)*~`!^\-_+<>@#$%&\\=('"]/;
  if (regex.test(str)) {
    return true;
  }
  return false;
}

export function validationPassword(password: string) {
  const num = password.search(/[0-9]/g);
  const eng = password.search(/[a-zA-Z]/g);
  const sp = password.search(
    /[a-zA-Z0-9{}[\]\\/?.,;:|)*~`!^\-_+<>@#$%&\\=('"]/g,
  );
  const space = password.search(/\s/);

  if (password.length < 8 || password.length > 16) {
    return false;
  }
  if (notAllowedStringCheck(password)) {
    return false;
  }
  if (space !== -1) {
    return false;
  }
  if (num === -1 || eng === -1 || sp === -1) {
    return false;
  }
  return true;
}

export function createSalt() {
  const buf = randomBytes(64);
  return buf.toString("base64");
}

export function createHashPassword(password: string) {
  const salt = createSalt();
  const key = pbkdf2Sync(password, salt, 101243, 64, "sha512");
  const hashedPassword = key.toString("base64");
  return { salt, hashedPassword };
}

export function createHash(text: string) {
  const key = pbkdf2Sync(
    text,
    process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
    101243,
    64,
    "sha512",
  );
  const hashedPassword = key.toString("base64");
  return hashedPassword;
}

export function isValidPassword(
  entered: string,
  hashedPassword: string,
  salt: string,
) {
  const key = pbkdf2Sync(entered, salt, 101243, 64, "sha512");
  const pass = key.toString("base64");

  if (hashedPassword === pass) {
    return true;
  }
  return false;
}

export function validateEmail(email: string) {
  const re =
    /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  return re.test(email);
}
