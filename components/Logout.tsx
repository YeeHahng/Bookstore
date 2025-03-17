'use client'
import React from 'react'
import { signOut } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';

function Logout() {
    const router = useRouter()
    return (
        <button 
        onClick = {async () => {
            await signOut();
            router.push('/signup')
        }}
        className="hover:underline">
            Signout
        </button>
    )
}

export default Logout