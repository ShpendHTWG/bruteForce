import { describe, it, expect} from "vitest";
import { buildParamsForParallelTime, buildParamsForPercentage, buildParamsForSequentialTime, calculateRelativePasswordAmount, generateStartPassword, incrementPassword, passwordEqualsHash } from "../bin/passwordUtils";
const { createHash } = require('crypto');


describe('passwordEqualsHash', () => {
    it('should return true if the password equals the hash', () => {
        const password = "password123";
        const hash = createHash('sha256').update("password123").digest('base64');
        
        const result = passwordEqualsHash(password, hash);

        expect(result).toBe(true);
    });

    it('should return false if the password does not equal the hash', () => {
        const password = "PASSWORD123";
        const hash = createHash('sha256').update("password123").digest('base64');

        const result = passwordEqualsHash(password, hash);

        expect(result).toBe(false);
    });
});

describe('incrementPassword', () => {
    it('should return b if the password is a, there is only one worker and the alphabet is abc', () => {
        const password = "a";
        const alphabet = ["a", "b", "c"];
        const workerAmount = 1;
        
        const result = incrementPassword(password, alphabet, workerAmount);

        expect(result).toBe("b");
    });

    it('should return c if the password is a, the increment is 2 and the alphabet is abc', () => {
        const password = "a";
        const alphabet = ["a", "b", "c"];
        const increment = 2;
        
        const result = incrementPassword(password, alphabet, increment);

        expect(result).toBe("c");
    });
    
    it('should return ba if the password is a, the increment is 3 and the alphabet is abc', () => {
        const password = "a";
        const alphabet = ["a", "b", "c"];
        const increment = 3;
        
        const result = incrementPassword(password, alphabet, increment);

        expect(result).toBe("ba");
    });

    it('should return bba if the password is a, the increment is  and the alphabet is abc', () => {
        const password = "a";
        const alphabet = ["a", "b", "c"];
        const increment = 9;
        
        const result = incrementPassword(password, alphabet, increment);

        expect(result).toBe("baa");
    });
});

describe('generateStartPassword', () => {
    it('should return aaa if the workerId is 0, the alphabet is abc and the passwordLength is 3', () => {
        const workerId = 0;
        const alphabet = ["a", "b", "c"];
        const passwordLength = 3;
        
        const result = generateStartPassword(workerId, alphabet, passwordLength);

        expect(result).toBe("aaa");
    });

    it('should return aaab if the workerId is 1, the alphabet is abc and the passwordLength is 4', () => {
        const workerId = 1;
        const alphabet = ["a", "b", "c"];
        const passwordLength = 4;
        
        const result = generateStartPassword(workerId, alphabet, passwordLength);

        expect(result).toBe("aaab");
    });

    it('should return baaa if the workerId is 32, the alphabet is abc and the passwordLength is 4', () => {
        const workerId = 27;
        const alphabet = ["a", "b", "c"];
        const passwordLength = 4;
        
        const result = generateStartPassword(workerId, alphabet, passwordLength);

        expect(result).toBe("baaa");
    });
});

describe('buildParamsForSequentialTime', () => {
    it('should return sequential data for a found password', () => {
        const result = buildParamsForSequentialTime(["a", "b", "c"], 3, 1, 1, true, "aabbcc");

        expect(result.TableName).toBe("Times");
        expect(result.Item.Id).toStrictEqual({"S" : "local_sequential_found_true"});
        expect(result.Item.Alphabet).toStrictEqual({"S" : "a,b,c"});
        expect(result.Item.PasswordLength).toStrictEqual({"S" : "3"});
        expect(result.Item.TotalTime).toBeDefined();
        expect(result.Item.ProcessingTime).toBeDefined();
        expect(result.Item.Found).toStrictEqual({"S" : "true"});
        expect(result.Item.Password).toStrictEqual({"S" : "aabbcc"});
    });

    it('should return sequential data for a not found password', () => {
        const result = buildParamsForSequentialTime(["a", "b", "c"], 3, 1, 1, false, undefined);

        expect(result.TableName).toBe("Times");
        expect(result.Item.Id).toStrictEqual({"S" : "local_sequential_found_false"});
        expect(result.Item.Alphabet).toStrictEqual({"S" : "a,b,c"});
        expect(result.Item.PasswordLength).toStrictEqual({"S" : "3"});
        expect(result.Item.TotalTime).toBeDefined();
        expect(result.Item.ProcessingTime).toBeDefined();
        expect(result.Item.Found).toStrictEqual({"S" : "false"});
        expect(result.Item.Password).toBeUndefined();
    });
});

describe('buildParamsForParallelTime', () => {
    it('should return parallel data for a found password', () => {
        const result = buildParamsForParallelTime(["a", "b", "c"], 3, 3, 1, 1, true, "aabbcc");

        expect(result.TableName).toBe("Times");
        expect(result.Item.Id).toStrictEqual({"S" : "local_parallel_3_workers_found_true"});
        expect(result.Item.Alphabet).toStrictEqual({"S" : "a,b,c"});
        expect(result.Item.PasswordLength).toStrictEqual({"S" : "3"});
        expect(result.Item.TotalTime).toBeDefined();
        expect(result.Item.ProcessingTime).toBeDefined();
        expect(result.Item.Found).toStrictEqual({"S" : "true"});
        expect(result.Item.Password).toStrictEqual({"S" : "aabbcc"});
    });

    it('should return parallel data for a not found password', () => {
        const result = buildParamsForParallelTime(["a", "b", "c"], 3, 3, 1, 1, false, undefined);

        expect(result.TableName).toBe("Times");
        expect(result.Item.Id).toStrictEqual({"S" : "local_parallel_3_workers_found_false"});
        expect(result.Item.Alphabet).toStrictEqual({"S" : "a,b,c"});
        expect(result.Item.PasswordLength).toStrictEqual({"S" : "3"});
        expect(result.Item.TotalTime).toBeDefined();
        expect(result.Item.ProcessingTime).toBeDefined();
        expect(result.Item.Found).toStrictEqual({"S" : "false"});
        expect(result.Item.Password).toBeUndefined();
    });
});

describe('buildParamsForPercentage', () => {
    it('should return data for 1% for seq', () => {
        const result = buildParamsForPercentage(1, ["a", "b", "c"], 4, 1, 1, 1);

        expect(result.TableName).toBe("Percentages");
        expect(result.Item.Id).toStrictEqual({"S" : "local_seq_01%"});
        expect(result.Item.Alphabet).toStrictEqual({"S" : "a,b,c"});
        expect(result.Item.PasswordLength).toStrictEqual({"S" : "4"});
        expect(result.Item.TotalTime).toBeDefined();
        expect(result.Item.ProcessingTime).toBeDefined();
    });

    it('should return data for 33% for seq', () => {
        const result = buildParamsForPercentage(33, ["a", "b", "c", "d"], 5, 1, 1, 1);

        expect(result.TableName).toBe("Percentages");
        expect(result.Item.Id).toStrictEqual({"S" : "local_seq_33%"});
        expect(result.Item.Alphabet).toStrictEqual({"S" : "a,b,c,d"});
        expect(result.Item.PasswordLength).toStrictEqual({"S" : "5"});
        expect(result.Item.TotalTime).toBeDefined();
        expect(result.Item.ProcessingTime).toBeDefined();
    });

    it('should return data for 4% for par', () => {
        const result = buildParamsForPercentage(4, ["a", "b", "c"], 4, 1, 1, 8);

        expect(result.TableName).toBe("Percentages");
        expect(result.Item.Id).toStrictEqual({"S" : "local_par_04%"});
        expect(result.Item.Alphabet).toStrictEqual({"S" : "a,b,c"});
        expect(result.Item.PasswordLength).toStrictEqual({"S" : "4"});
        expect(result.Item.TotalTime).toBeDefined();
        expect(result.Item.ProcessingTime).toBeDefined();
    });

    it('should return data for 74% for par', () => {
        const result = buildParamsForPercentage(74, ["a", "b", "c"], 2, 1, 1, 7);

        expect(result.TableName).toBe("Percentages");
        expect(result.Item.Id).toStrictEqual({"S" : "local_par_74%"});
        expect(result.Item.Alphabet).toStrictEqual({"S" : "a,b,c"});
        expect(result.Item.PasswordLength).toStrictEqual({"S" : "2"});
        expect(result.Item.TotalTime).toBeDefined();
        expect(result.Item.ProcessingTime).toBeDefined();
    });
});

describe('calculateRelativePasswordAmount', () => {
    it('should return 10 if the alphabetSize is 10, the passwordLength is 2 and the workerAmount is 10', () => {
        const alphabetSize = 10;
        const passwordLength = 2;
        const workerAmount = 10;
        
        const result = calculateRelativePasswordAmount(alphabetSize, passwordLength, workerAmount);

        expect(result).toBe(10);
    });

    it('should return 256 if the alphabetSize is 2, the passwordLength is 8 and the workerAmount is 4', () => {
        const alphabetSize = 2;
        const passwordLength = 10;
        const workerAmount = 4;
        
        const result = calculateRelativePasswordAmount(alphabetSize, passwordLength, workerAmount);

        expect(result).toBe(256);
    });
});
