const { createHash } = require('crypto');
const { crackPasswordWithParallelAlgorithm } = require('./bin/localParallel');
const { generateStartPassword } = require('./bin/passwordUtils');

const alphabet = process.argv[2].split('');
const passwordLength = process.argv[3];
const workerAmount = process.argv[4];

const password = generateStartPassword(0, alphabet, passwordLength + 1);
const passwordHash = createHash('sha256').update(password).digest('base64');

const startTime = Date.now();

main();

async function main() {
    const result = await crackPasswordWithParallelAlgorithm(alphabet, passwordHash, workerAmount, passwordLength, startTime);

    if (result.found) {
        console.log(`Passwort gefunden: ${result.password}`);
        console.log(`Gesamtzeit: ${Date.now() - startTime} ms`);
    } else {
        console.log(`Passwort nicht gefunden.`);
        console.log(`Gesamtzeit: ${Date.now() - startTime} ms`);
    }
}