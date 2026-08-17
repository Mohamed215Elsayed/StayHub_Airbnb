import { randomBytes, scrypt, timingSafeEqual } from 'crypto';

const SALT_LENGTH = 32;
const KEY_LENGTH = 64;
const SCRYPT_PARAMS = { N: 2 ** 14, r: 8, p: 1 } as const;

async function scryptAsync(
  password: string | Buffer,
  salt: string | Buffer,
  keylen: number,
  options: { N: number; r: number; p: number },
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, keylen, options, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey);
    });
  });
}

export async function hash(plain: string): Promise<string> {
  const salt = randomBytes(SALT_LENGTH);
  const derivedKey = await scryptAsync(plain, salt, KEY_LENGTH, SCRYPT_PARAMS);
  return `${salt.toString('base64')}:${derivedKey.toString('base64')}`;
}

export async function verify(stored: string, plain: string): Promise<boolean> {
  const [saltB64, hashB64] = stored.split(':');
  if (!saltB64 || !hashB64) return false;

  const salt = Buffer.from(saltB64, 'base64');
  const expected = Buffer.from(hashB64, 'base64');
  const derivedKey = await scryptAsync(
    plain,
    salt,
    expected.length,
    SCRYPT_PARAMS,
  );

  if (derivedKey.length !== expected.length) return false;
  return timingSafeEqual(derivedKey, expected);
}
