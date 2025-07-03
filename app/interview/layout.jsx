'use client'

import React, { useState } from 'react'
import InterviewHeader from './_components/InterviewHeader'
import { InterviewDataContext } from '@/context/InterviewDataContext'

function InterviewLayout({children}) {
  const [interviewInfo, setInterviewInfo] = useState(null);

  return (
      <div className='min-h-screen bg-secondary'>
        <InterviewHeader />
        <main className='min-h-screen bg-secondary'>
          <InterviewDataContext.Provider value={{ interviewInfo, setInterviewInfo }}>
            {children}
          </InterviewDataContext.Provider>
        </main>
    </div>
  )
}

export default InterviewLayout
