"use client"
import NextTransitionBar from 'next-transition-bar';
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from 'next/navigation'; // Updated imports

const NextNProgressClient = () => {
    const [zIndex, setZIndex] = useState(0);
    const pathname = usePathname(); // Use the usePathname hook
    const searchParams = useSearchParams(); // Use the useSearchParams hook

    useEffect(() => {
        // Update zIndex when the route changes
        const handleRouteChange = () => {
            setZIndex(-99);
            console.log(pathname);
            console.log(zIndex);
            
            
        };

        // Call the handleRouteChange function when pathname or searchParams changes
        handleRouteChange();

        // There's no need for a cleanup function since we're not setting up any subscriptions
    }, [pathname, searchParams]); // Depend on pathname and searchParams

    return <NextTransitionBar zIndex={zIndex} />;
};

export default NextNProgressClient;
