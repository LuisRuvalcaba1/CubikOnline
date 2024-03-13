import { useStore } from '../context/StoreContext';
import { useForm } from 'react-hook-form';
import { useProductAuth } from '../context/ProductContext.jsx';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';


function Store() {
    const { createNewStore, getStores } = useStore();
    const { register, handleSubmit } = useForm();
    const { user } = useAuth();
    const { getProductsOnStore } = useProductAuth();
    const [products, setProducts] = useState([]);
    const [boughtProducts, setBoughtProducts] = useState([]);

    useEffect(() => {
        const fetchStores = async () => {
            const stores = await getStores();
            setBoughtProducts(stores);
        };
        fetchStores();
    }, [getStores]);

    const onSubmit = handleSubmit((data) => {
        createNewStore(data);
    })

    useEffect(() => {
        const fetchProducts = async () => {
            const products = await getProductsOnStore();
            setProducts(products);
            console.log(products);
        };
        fetchProducts();
    }, [getProductsOnStore]);

    return (
        <div>
            <h1>Store</h1>
            <div>
                <h2>Products</h2>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    {products.map((product) => (
                        <div key={product.name} style={{ marginRight: '60px' }}>
                            <h3>{product.name}</h3>
                            <p>{product.price}</p>
                            <form onSubmit={onSubmit}>
                                <input
                                    type='hidden'
                                    value={product._id}
                                    {...register('product')}
                                />
                                <input
                                    type='hidden'
                                    value={user._id}
                                    {...register('user')}
                                />
                                <button type='submit'>Buy</button>
                            </form>
                        </div>

                    ))}

                </div>
            </div>
        </div>
    )
}

export default Store;