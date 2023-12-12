"use client"
import { cn } from "@/lib/utils";
import { Button } from "./ui/button"
import { Sparkles } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/router';
interface SubscriptionButtonProps {
    className?:string
    isPro?:boolean
}

const SubscriptionButton:React.FC<SubscriptionButtonProps> = ({className,isPro}) => {
    const [loading, setLoading] = useState(false)
    const {toast} = useToast()
    // const handleSubcribe = async ()=>{
    //     try {
    //         setLoading(true)
    //         const {} = await axios.get("/api/stripe")
    //     } catch (error) {
    //         toast({
    //             title: "Error",
    //            variant:"destructive",
    //            description:"Something went wrong !"
    //         })
    //     }finally{
    //         setLoading(false)
    //     }
    // }
  return (
    <div className={className}>
       <a href="https://t.me/GeminiAI_Sol" target="_blank" rel="noopener noreferrer">
       <Button variant="outline" size="lg" disabled={loading}
        //  onClick={handleSubcribe}
          className={cn(
            "text-white w-full font-semibold border-none gradient-btn",
            "hover:text-white"
        )}> 
            <span>{isPro ? "Manage Subcription" :"Telegram"}</span>
            <Sparkles/>
        </Button>
       </a>
    </div>
  )
}

export default SubscriptionButton