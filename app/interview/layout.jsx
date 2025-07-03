import React from 'react'
import InterviewHeader from './_components/InterviewHeader'

function interviewLayout({children}) {
  return (
      <div className='min-h-screen bg-secondary'>
        <InterviewHeader />
        <main className='min-h-screen bg-secondary'>
          {children}
        </main>
    </div>
  )
}

export default interviewLayout
