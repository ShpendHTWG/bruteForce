const { createHash } = require('crypto');

function passwordEqualsHash(passwordToTry, passwordHash) {
    return createHash('sha256').update(passwordToTry).digest('base64') === passwordHash;
}

function generateStartPassword(workerId, alphabet, passwordLength) {
    let password = alphabet[0].repeat(passwordLength);

    password = incrementPassword(password, alphabet, workerId);

    return password;
}

function incrementPassword(passwordToTry, alphabet, increment) {
    let password = passwordToTry.split("");
    let passwordAsNumbers = [];

    for (let i = 0; i < password.length; i++) {
        passwordAsNumbers[i] = alphabet.indexOf(password[i]);
    }

    let uebertrag = increment;
    let charPos = password.length - 1;

    do {
        const resultOfAddition = (charPos >= 0 ? passwordAsNumbers[charPos] : 0) + uebertrag;

        if (charPos >= 0) {
            passwordAsNumbers[charPos] = resultOfAddition % alphabet.length;
        } else {
            passwordAsNumbers.unshift(resultOfAddition % alphabet.length);
        }
        
        uebertrag = Math.floor(resultOfAddition / alphabet.length);
        charPos--;
    } while (uebertrag !== 0);

    for (let i = 0; i < passwordAsNumbers.length; i++) {
        password[i] = alphabet[passwordAsNumbers[i]];
    }

    return password.join("");
}

function buildParamsForSequentialTime(alphabet, passwordLength, startTime, startProcessingTime, found, password) {
    const entry = {
        Id: { "S": found ? `local_sequential_found_true` : `local_sequential_found_false` },
        Alphabet: { "S": alphabet.toString() },
        PasswordLength: { "S": passwordLength.toString() },
        TotalTime: { "S": `${Date.now() - startTime} ms` },
        ProcessingTime: { "S": `${Date.now() - startProcessingTime} ms` },
        Found: { "S": found ? "true" : "false" },
    };

    if (found) {
        entry.Password = { "S": password };
    }

    return {
        TableName: "Times",
        Item: entry
    };
}

function buildParamsForParallelTime(alphabet, workerAmount, passwordLength, startTime, startProcessingTime, found, password) {
    const entry = {
        Id: { "S": found ? `local_parallel_${workerAmount}_workers_found_true` : `local_parallel_${workerAmount}_workers_found_false` },
        Alphabet: { "S": alphabet.toString() },
        PasswordLength: { "S": passwordLength.toString() },
        TotalTime: { "S": `${Date.now() - startTime} ms` },
        ProcessingTime: { "S": `${Date.now() - startProcessingTime} ms` },
        Found: { "S": found ? "true" : "false" },
    };

    if (found) {
        entry.Password = { "S": password };
    }

    return {
        TableName: "Times",
        Item: entry
    };
}

function buildParamsForPercentage(percent, alphabet, passwordLength, startTime, startProcessingTime, workerAmount) {
    const entry = {
        Alphabet: { "S": alphabet.toString() },
        PasswordLength: { "S": passwordLength.toString() },
        TotalTime: { "S": `${Date.now() - startTime} ms` },
        ProcessingTime: { "S": `${Date.now() - startProcessingTime} ms` }
    };

    if (percent < 10) {
        entry.Id = { "S": workerAmount === 1 ? `local_seq_0${percent.toString()}%` : `local_par_0${percent.toString()}%` };
    } else {
        entry.Id = { "S": workerAmount === 1 ? `local_seq_${percent.toString()}%` : `local_par_${percent.toString()}%` };
    }

    return {
        TableName: "Percentages",
        Item: entry
    };
}

function calculateRelativePasswordAmount(alphabetSize, passwordLength, workerAmount) {
    return Math.pow(alphabetSize, passwordLength) / workerAmount;
}

module.exports = {
    generateStartPassword,
    passwordEqualsHash,
    incrementPassword,
    buildParamsForSequentialTime,
    buildParamsForParallelTime,
    buildParamsForPercentage,
    calculateRelativePasswordAmount
};