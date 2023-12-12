interface LogoProps {
    className?: string;
}


import { cn } from '@/lib/utils';
import { BrainCircuit } from 'lucide-react';
import Image from 'next/image'
import React from 'react'
import { Poppins } from 'next/font/google';
const poppins = Poppins({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-poppins',
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
  });
const Logo: React.FC<LogoProps> = ({ className  }) => {
    return (
        <div className={cn("flex items-center",
            className)}>
            {/* <BrainCircuit color='#0ea5e9' size={40} /> */}
            <Image src={'gemini.png'} alt="Description of the image" width={140} height={2} style={{height:"92px",width:"92px"}} />

            {/* đối tượng có sẵn chứ ko phải cái className bên trong */}
            <span className={cn("ml-2 font-bold text-3xl",poppins.className)}> 
                {/* BrainFast */}
            </span>
        </div>

    )
}

export default Logo