import { mergeDeep, mergeConfigIfOverridesPresent, Config } from "../src/util/config"
import { Fixture, getFixturePath } from "./fixtures/fixture-util";

describe("Test mergeDeep |", () => {
    it("can merge two objects that shares key", () => {
        const objA = {a: 1, o: {a: 1}}
        const objB = {b: 1, o: {a: 2, b: 2}}
        const merged = mergeDeep(objA, objB);
        expect(merged).toEqual({
            a: 1,
            b: 1,
            o: {
                a: 2,
                b: 2,
            }
        })
    });

    it("can merge two objects that shares no key", () => {
        const objA = {a: 1}
        const objB = {b: 1}
        const merged = mergeDeep(objA, objB);
        expect(merged).toEqual({
            a: 1,
            b: 1,
        })
    })
})

describe("Test mergeDeep |", () => {
    it("can merge config as expected", async () => {
        const base: Config = {merx: {input: "i", output: "o", upload: {host: "h", port: 1, pass: "p", user: "u", path: "/"}}}        
        const overridesPath = getFixturePath(Fixture.config);

        const merged = await mergeConfigIfOverridesPresent(base, overridesPath);
        expect(merged).toEqual({
            merx: {
                input: "http://my-host.com",
                output: "o",
                upload: {
                    host: "h",
                    port: 1,
                    user: "user",
                    pass: "123456",
                    path: "/"
                }
            }
        })
    })
})
