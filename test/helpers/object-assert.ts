export function assertObjectProperties<T extends Object>(testObject: T, expectObject: T) {
    for(const key of Object.keys(expectObject)) {
        if(! (key in testObject)) {
            fail(`TestObject was expected to have key ${key}`);
        }
        const expected = expectObject[key];
        const actual = testObject[key];

        if(typeof expected !== typeof actual) {
            fail(`Type of value at ${key} miss match. Expected: ${typeof expected} Got: ${typeof actual}`);
        }

        if(typeof actual === "object") {
            assertObjectProperties(actual, expected)
        }
        if(typeof actual === "number" || typeof actual === "bigint") {
            expect(actual).withContext("Key: "+key).toBeCloseTo(expected, 0.01)
        }
        if(typeof actual === "boolean" || typeof actual === "string" || typeof actual === "symbol" || typeof actual === "undefined") {
            expect(actual).withContext("Key: "+key).toEqual(expected)
        }
    }
}