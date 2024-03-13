import { useForm } from 'react-hook-form';
import { useProductAuth } from "../context/ProductContext.jsx";

function ProductPage() {
    const { register, handleSubmit } = useForm();
    const { createNewProduct } = useProductAuth();

    const onSubmit = handleSubmit(async (data) => {
        createNewProduct(data);
    })

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
        </div>
    );
}

export default ProductPage;