const { crackPasswordWithBruteForce } = require('./bruteForce');
const { createEntry } = require('./dbAccessor');
const { buildParamsForSequentialTime } = require('./passwordUtils');

async function crackPasswordWithSequentialAlgorithm(alphabet, passwordHash, passwordLength, startTime) {
    passwordLength = parseInt(passwordLength);
 
    const result = await crackPasswordWithBruteForce(0, alphabet, passwordHash, 1, passwordLength, startTime, startTime);

    await createEntry(buildParamsForSequentialTime(alphabet, passwordLength, startTime, startTime, result.found, result.password));

    return result;
}

module.exports = {
    crackPasswordWithSequentialAlgorithm
};