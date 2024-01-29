export type MerxProduct = {
    article_nr: string,
    description1: string,
    minimum_sell: number,
    price: number,
    stock_quantity: number,
    netprice: number,
}

export type MerxProductOverview = {
    merx_products: {
        product: MerxProduct[];
    }
}