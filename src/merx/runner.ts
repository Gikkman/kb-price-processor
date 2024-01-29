import path from "path";
import { MerxProduct, MerxProductOverview } from "./types";
import { Config } from "../util/config";
import files from "../util/files";
import { readXml, stringify } from "../util/xml";
import { upload  } from "../util/ftp";

export default { fetchXml, run, uploadXml }

async function fetchXml(config: Config) {
    const xmlDocument = await readXml<MerxProductOverview>(config.merx.input, ["article_nr", "rek_pris", "thickness"]);
    return xmlDocument;
}

async function run(xmlDocument: MerxProductOverview, workDir: string, config: Config) {
    // Apply rules
    const processedProducts: MerxProduct[] = []
    for(const product of xmlDocument.merx_products.product) {
        const processedProduct = processProductRules(product);
        processedProducts.push(processedProduct);
    }
    
    // Store XML on disc
    const outputFileLocation = path.join(workDir, config.merx.output);
    const newDocument: MerxProductOverview = {
        merx_products: {
            product: processedProducts
        }
    };
    const content = stringify(newDocument);
    await files.write(content, outputFileLocation)

    return outputFileLocation;
}

async function uploadXml(xmlFileLocation: string, config: Config) {
    await upload(config.merx.upload, {inputPath: xmlFileLocation, uploadPath: config.merx.upload.path})
}

/********************************************************************
 *                      Product Rules
 ********************************************************************/

export function processProductRules(product: MerxProduct): MerxProduct {
    const newDescription1 = processDescriptionRule(product);
    const newStockQuantity = processStockQuantityRule(product);
    const newPrice = processPriceRule(product);

    return {
        ...product,
        description1: newDescription1,
        stock_quantity: newStockQuantity,
        price: newPrice
    };
}

export function processDescriptionRule(product: MerxProduct) {
    if(product.minimum_sell && product.minimum_sell > 1) {
        return `${product.description1} (${product.minimum_sell}-pack)`;
    }
    return product.description1;
}

export function processStockQuantityRule(product: MerxProduct) {
    if(product.minimum_sell && product.minimum_sell > 1) {
        return Math.floor( product.stock_quantity / product.minimum_sell )
    }
    return product.stock_quantity;
}

export function processPriceRule(product: MerxProduct) {
    // Sell price: price * priceFactor * minimum_sell. If the result is less than 100, add 3.
    // Price factor: if netprice == 0 -> 1.3 , if netprice == 1 -> 2.25
    const priceFactor = calculatePriceFactor(product);
    const sellPrice = product.price * priceFactor * product.minimum_sell;
    const adjustedSellPrice = sellPrice < 100 ? sellPrice + 3 : sellPrice;
    return Math.ceil(adjustedSellPrice);
}

function calculatePriceFactor(product: MerxProduct) {
    if(product.netprice === 0) {
        return 1.3;
    }
    if(product.netprice === 1) {
        return 2.25;
    }
    throw `Product ${product.article_nr} had an unexpected 'netprice' value. Expect 0 or 1, found ${product.netprice}`
}