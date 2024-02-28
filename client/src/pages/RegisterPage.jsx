import {useForm} from 'react-hook-form';
import { useAuth } from '../context/AuthContext.jsx';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
function RegisterPage(){

    const {register, handleSubmit, formState:{errors} } = useForm();
    const {signup, isAuthenticated, errors: registerErrors} = useAuth();
    const navigation = useNavigate();   
    useEffect(()=> {
        if(isAuthenticated) navigation('/profile');
    }, [isAuthenticated]);

    const onSubmit = handleSubmit(async(values)=> {
        await signup(values);
    });

    return(
        <div className='flex h-screen items-center justify-center'>        
            <div className='bg-zinc-800 max-w-md p-10 rounded-md'>
            {
                registerErrors.map((error, i) =>(
                <div className='bg-red-500 p-2 text-white' key={i}>
                    {error}
                </div>))
                // registerErrors.map((error, i) =>(
                //     <div className='bg-red-500 p-2 text-white' key={i}>
                //         {error}
                //     </div>
                // ))
            }
            <form onSubmit={onSubmit}>
                <input type="text" {... register('username', {required:true})} 
                className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md'
                placeholder='Username'/>
                {errors.username && <p className='text-red-500'>Username is required</p>}
                <input type="email" {... register("email", {required:true})}
                className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md'
                placeholder='Email'/>
                {errors.email && <p className='text-red-500'>Email is required</p>}
                <input type="password" {... register("password", {required:true})} 
                className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md'
                placeholder='Password'/>
                {errors.password && <p className='text-red-500'>Password is required</p>}
                <button type="submit">Register</button>

                <p className='flex gap-x-2 justify-between'>Already have an account?
                    <Link to="/login" className='sky-text-500'>Login</Link>
                </p>
            </form>
        </div>
        </div>
    )
}

export default RegisterPage;