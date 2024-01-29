import MerxRunner from '../src/merx/runner';
import { MerxProductOverview } from '../src/merx/types';
import { Config } from '../src/util/config';
import { readXml } from '../src/util/xml';
import { Project, cleanupTemporaryWorkDirectories, createTemporaryWorkDirectory, getXmlFixturePath } from './fixtures/fixture-util';
import { assertObjectProperties } from './helpers/object-assert';

describe("Test Merx flow |", () => {
    let workDir: string;
    beforeAll(() => {
        workDir = createTemporaryWorkDirectory();
    })
    afterAll(() => {
        cleanupTemporaryWorkDirectories();
    });

    const config: Config = {
        merx: {
            input: getXmlFixturePath(Project.merx),
            output: "merx-results.xml",
        }
    } as Config;

    it("can process XML, and output correctly", async () => {
        const originalXml = await MerxRunner.fetchXml(config);
        assertObjectProperties(
            originalXml.merx_products.product[0], 
            {article_nr: "04755", description1: "Snapsglas 4,5 cl Granity", price: 21.00, minimum_sell: 48, netprice: 0, stock_quantity: 144}
        )
        assertObjectProperties(
            originalXml.merx_products.product[1], 
            {article_nr: "2095560", description1: "Contigo Byron, Gunmetal", price: 125.00, minimum_sell: 96, netprice: 1, stock_quantity: 0}
        )
        assertObjectProperties(
            originalXml.merx_products.product[2], 
            {article_nr: "2095663", description1: "Contigo Byron, Matte Black", price: 125.00, minimum_sell: 96, netprice: 1, stock_quantity: 0}
        )
        assertObjectProperties(
            originalXml.merx_products.product[3], 
            {article_nr: "1005R", description1: "Bordsgaffel 180 mm Gammal Svensk", price: 309.00, minimum_sell: 1, netprice: 0, stock_quantity: 15}
        )
        assertObjectProperties(
            originalXml.merx_products.product[4], 
            {article_nr: "1007R", description1: "Dessertkniv 175 mm Gammal Svensk", price: 387.00, minimum_sell: 1, netprice: 0, stock_quantity: 56}
        )
        assertObjectProperties(
            originalXml.merx_products.product[5], 
            {article_nr: "09994", description1: "Skål Ø 26 cm, stapelbar", price: 12.00, minimum_sell: 6, netprice: 0, stock_quantity: 13}
        )

        const outputFileLocation = await MerxRunner.run(originalXml, workDir, config);
        const outputXml = await readXml<MerxProductOverview>(outputFileLocation, ["article_nr"]);
        assertObjectProperties(
            outputXml.merx_products.product[0], 
            {article_nr: "04755", description1: "Snapsglas 4,5 cl Granity (48-pack)", price: 21.00*48*1.3, minimum_sell: 48, netprice: 0, stock_quantity: 3}
        )
        assertObjectProperties(
            outputXml.merx_products.product[1], 
            {article_nr: "2095560", description1: "Contigo Byron, Gunmetal (96-pack)", price: 125.00*96*2.25, minimum_sell: 96, netprice: 1, stock_quantity: 0}
        )
        assertObjectProperties(
            outputXml.merx_products.product[2], 
            {article_nr: "2095663", description1: "Contigo Byron, Matte Black (96-pack)", price: 125.00*96*2.25, minimum_sell: 96, netprice: 1, stock_quantity: 0}
        )
        assertObjectProperties(
            outputXml.merx_products.product[3], 
            {article_nr: "1005R", description1: "Bordsgaffel 180 mm Gammal Svensk", price: 309.00*1.3, minimum_sell: 1, netprice: 0, stock_quantity: 15}
        )
        assertObjectProperties(
            outputXml.merx_products.product[4], 
            {article_nr: "1007R", description1: "Dessertkniv 175 mm Gammal Svensk", price: 387.00*1.3, minimum_sell: 1, netprice: 0, stock_quantity: 56}
        )
        assertObjectProperties(
            outputXml.merx_products.product[5], 
            {article_nr: "09994", description1: "Skål Ø 26 cm, stapelbar (6-pack)", price: 12.00*6*1.3+3, minimum_sell: 6, netprice: 0, stock_quantity: 2}
        )
    })
})