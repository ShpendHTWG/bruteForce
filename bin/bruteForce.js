const { createEntry } = require('./dbAccessor');
const { generateStartPassword, passwordEqualsHash, incrementPassword, calculateRelativePasswordAmount, buildParamsForPercentage } = require('./passwordUtils');

async function crackPasswordWithBruteForce(id, alphabet, passwordHash, workerAmount, passwordLength, startTime, startProcessingTime) {
    let passwordToTry = generateStartPassword(id, alphabet, passwordLength);

    const relativePasswordAmount = calculateRelativePasswordAmount(alphabet.length, passwordLength, workerAmount);
    const onePercent = relativePasswordAmount / 100;
    let passwordsTried = id;
    let percent = 1;
    let indexOfPercent = Math.ceil(onePercent * percent);

    while (passwordToTry.length === passwordLength) {
        if (passwordEqualsHash(passwordToTry, passwordHash)) {
            return { found: true, password: passwordToTry };
        }
        
        if (id === workerAmount - 1 && passwordsTried === indexOfPercent) {
            await createEntry(buildParamsForPercentage(percent, alphabet, passwordLength, startTime, startProcessingTime, workerAmount));
            percent++;
            indexOfPercent = Math.ceil(onePercent * percent);
        }

        passwordToTry = incrementPassword(passwordToTry, alphabet, workerAmount);
        passwordsTried++;
    }

    return { found: false, password: undefined };
}


module.exports = {
    crackPasswordWithBruteForce
};