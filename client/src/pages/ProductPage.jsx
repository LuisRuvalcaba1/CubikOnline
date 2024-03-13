import { useForm } from 'react-hook-form';
import { useProductAuth } from "../context/ProductContext.jsx";
import { useEffect, useState } from 'react';

function ProductPage() {
    const { register, handleSubmit } = useForm();
    const { createNewProduct, getProducts } = useProductAuth();
    const [products, setProducts] = useState([]);

    const onSubmit = handleSubmit(async (data) => {
        createNewProduct(data);
    })

    useEffect(() => {
            const fetchProducts = async () => {
                const products = await getProducts();
                setProducts(products);
                console.log(products);
            };
            fetchProducts();
        }, [getProducts]);
    return (
        <div>
            <h1>Product Page</h1>

            <form onSubmit={onSubmit}>
                <input type="text"
                    {...register("name", { required: true })}
                    placeholder="Name"
                    style={
                        {
                            fontSize: "20px",
                            color: "black",
                            fontWeight: "bold"
                        }} />
                <input type="number"
                    {...register("price", { required: true })}
                    placeholder="Price"
                    style={{
                        fontSize: "20px",
                        color: "black",
                        fontWeight: "bold",
                    }} />
                <button type="submit">Create</button>
            </form>

            <div>
                <h2>Products</h2>
                <ul>
                    {products.map((product) => (
                        <li key={product.name}>
                            <h3>{product.name}</h3>
                            <p>{product.price}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default ProductPage;