'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

function Interview() {
    const params = useParams();
    const interviewId = params.interview_Id;
    console.log(interviewId);
    
    const [interviewData, setInterviewData] = useState();
    const [userName, setUserName] = useState();
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        interviewId && GetInterviewHeader();
    },[interviewId])

    const GetInterviewHeader = async () => { 
        setLoading(true);
        try {
            let { data: Interviews, error } = await supabase
            .from('Interviews')
                .select("jobPosition, jobDescription, duration, type")
                .eq('interview_id', interviewId)
            setInterviewData(Interviews[0]);
            setLoading(false);
            if (Interviews.length === 0) {
                toast.error('Incorrect Interview Link');
                return;
            }
            
        } catch (error) {
            setLoading(false);
            console.log(error);
            toast.error('Incorrect Interview Link');
        }
    }

    
  return (
    <div className='px-10 mt-8 md:px-28 lg:px-48 xl:px-64'>
      <Card className='flex flex-col items-center p-8 bg-white rounded-lg'>
        {/* Header Section */}
        <h1 className='text-[#2563EB] text-2xl font-semibold mb-1'>AIcruiter</h1>
        <p className='mb-6 text-gray-600'>AI-Powered Interview Platform</p>
        
        {/* Main Image */}
        <Image 
          src="/assets/images/interview_logo6.png" 
          alt="Interview Platform Illustration"
          width={500}
          height={500}
          className='w-[300px] my-6'
        />

        {/* Interview Details */}
        <div className='flex gap-4 items-center mb-6 text-gray-600'>
          <div className='flex gap-2 items-center'>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span>Google Inc.</span>
          </div>
          <div className='flex gap-2 items-center'>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{interviewData?.duration}</span>
          </div>
        </div>

        <h2 className='mb-6 text-xl font-semibold'>{interviewData?.jobPosition}</h2>

        {/* Name Input */}
        <div className='mb-6 w-full max-w-md'>
          <label className='block mb-2 text-sm font-medium text-gray-700'>
            Enter your full name
          </label>
          <Input 
            type="text"
            placeholder="e.g., Mahmoud Hbaeib" onChange={(event) => setUserName(event.target.value)}
            className='w-full'
            required
          />
        </div>

        {/* Instructions Card */}
        <div className='w-full max-w-md bg-[#EEF2FF] p-4 rounded-lg mb-6'>
          <div className='flex gap-2 items-start'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className='mb-2 font-medium text-blue-600'>Before you begin</h3>
              <ul className='space-y-1 text-sm text-gray-600'>
                <li>• Ensure you have a stable internet connection</li>
                <li>• Test your camera and microphone</li>
                <li>• Find a quiet place for the interview</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='space-y-3 w-full max-w-md'>
                  <Button className='flex gap-2 justify-center items-center w-full text-white bg-blue-600 hover:bg-blue-700' disabled={loading||!userName}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Join Interview
          </Button>
          <Button variant="outline" className='flex gap-2 justify-center items-center w-full'>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Test Audio & Video
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default Interview
