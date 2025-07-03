import React from 'react'
import Image from 'next/image'

function interviewHeader() {
  return (
    <div className='p-4 shadow-sm'>
          <Image src="/assets/images/logo1.png" alt="logo" width={100} height={100}
            className='w-[140px]'
          />
    </div>
  )
}

export default interviewHeader
