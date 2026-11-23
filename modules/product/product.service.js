import * as productRepository from './product.repository.js';

export function listProducts() {
    return productRepository.findProducts();
}
