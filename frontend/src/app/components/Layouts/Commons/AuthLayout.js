"use client"
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from "react";
import { loadUserFromLocalStorage, reset } from "@/redux/features/auth";
import { useRouter } from "next/navigation";

export default function AuthLayout({children}) {
    const { user, isLoading } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const router = useRouter() 
    useEffect(() => {       
            dispatch(loadUserFromLocalStorage());        
    }, [dispatch]);

    useEffect(() => {
        if (user) {            
        }
        else if (!user){
            router.push("/auth/login")
        }
        dispatch(reset())
    }, [user, router]);

    if (isLoading) {
        return <div>Loading...</div>;
    }
    return <>    
    <Navbar/>
    <div className="container-fluid">
    <div className="row">
        <Sidebar/>
        <main
        role="main"
        className="col-md-9 ml-sm-auto col-lg-10 px-4"
        >
        {children}
        </main>
    </div>
    </div>
    </>;
}

