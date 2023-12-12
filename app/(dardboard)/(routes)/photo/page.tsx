"use client"
import React, { useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { toast } from '@/components/ui/use-toast';
import ToolsNavigation from '@/components/dashboard/tools-navigation';
import { cn } from '@/lib/utils';
import AiResponse from '@/components/dashboard/ai-response';
import UserMessage from '@/components/dashboard/user-message';
import Loading from '@/components/loading';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { PHOTO_AMOUNT_OPTIONS, PHOTO_RESOLUTION_OPTIONS } from "@/constants";


const formSchema = z.object({
  prompt: z.string().min(1, {
    message: "Photo prompt is required"
  }),
  amount: z.string().min(1),
  resolution: z.string().min(1),
});

interface MessageType {
  id: string;
  content: string | string[];
  role: 'user' | 'assistant';
}

const PhotoPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      amount: "1",
      resolution: "512x512"
    }
  });

  const isLoading = form.formState.isSubmitting;

  const handleScrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight ;
    }
  }
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    handleScrollToBottom()
    try {

      setMessages(current => ([...current, {
        id: uuidv4(),
        role: 'user',
        content: `${values.prompt} | ${values.amount} | ${values.resolution}`
      },
      {
        id: uuidv4(),
        role: 'assistant',
        content: ""
      }
      ]))

      handleScrollToBottom();

      form.reset()

      const { data } = await axios.post("/api/photo", values)
      const urls = data.data.map((image: { url: string }) => image.url);

      setMessages(current => {
        const newMessages = [...current];
        newMessages[newMessages.length - 1].content = urls;
        return newMessages;
      });
      handleScrollToBottom();

    } catch (error: any) {
      if (error?.response?.status === 403) {

      } else {
        setMessages([]);
        toast({
          variant: "destructive",
          description: "Something went wrong. Please try again.",
        });

      }
    }
  }


  const handleClearChat = () => {
    setMessages([]);
  }


  return (
    <div>
      <div className="h-full relative flex flex-col justify-between">
        {/* containerRef là một công cụ mạnh mẽ để tương tác với phần tử HTML trong React và thường được sử dụng khi bạn cần thực hiện các thay đổi hoặc tương tác với phần tử DOM trong ứng dụng của bạn. */}
        <div ref={containerRef} className="h-[calc(100vh-180px)] relative overflow-y-auto space-y-10 scroll-smooth">
          {messages.length > 0 ?
            <>
              {messages.map(m => (
                <div key={m.id} className="whitespace-pre-wrap">
                  {
                    m.role === 'user' ?
                      <UserMessage>{m.content}</UserMessage>
                      :
                      <AiResponse>
                        {
                          m.content ? <div className={cn(
                            "block mb-4 space-y-4",
                            "lg:flex lg:flex-wrap lg:items-center lg:space-x-4 lg:space-y-0"
                          )}>
                            {
                              typeof m.content === "object"
                              && m.content?.map((url: string) =>
                                <div key={url}>
                                  <Image
                                    src={url}
                                    width={200}
                                    height={200}
                                    className="rounded-lg"
                                    alt={url} />
                                  <a href={url} target="_blank">
                                    <Button
                                      size="sm"
                                      className="w-[200px] mt-2">
                                      Download
                                    </Button>
                                  </a>
                                </div>
                              )
                            }
                          </div>
                            :
                            <Loading />
                        }
                      </AiResponse>
                  }
                </div>
              ))}
              <div className="absolute left-0 bottom-0 text-right w-full pr-3">
                <Button
                  size="sm"
                  onClick={handleClearChat}
                  variant="outline"
                >
                  Clear chat
                </Button>
              </div>
            </>
            :
            <ToolsNavigation title='Photo'></ToolsNavigation>
          }
        </div>
      </div>
      <div className="mb-[13px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-center w-full relative">
            <FormField
              name="prompt"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Textarea
                      placeholder="Please enter the image you want to create..."
                      className="min-h-1 resize-none"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
         <div className="absolute right-2 flex items-center space-x-4">
         <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      disabled={isLoading}
                      defaultValue={field.value}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PHOTO_AMOUNT_OPTIONS.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="resolution"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      value={field.value}
                      defaultValue={field.value}
                      disabled={isLoading}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PHOTO_RESOLUTION_OPTIONS.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <Button type='submit' disabled={isLoading} className="gradient-btn">
                  <Send/>
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default PhotoPage


