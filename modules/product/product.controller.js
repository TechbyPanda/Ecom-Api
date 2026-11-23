import * as productService from './product.service.js';

export async function listProducts(req, res) {
    const result = await productService.listProducts();
    res.status(200).json(result);
}
