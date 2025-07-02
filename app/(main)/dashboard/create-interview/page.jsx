'use client';

import React, { useState } from 'react'
import FormContainer from './_components/FormContainer'
import QuestionList from './_components/QuestionList'
import InterviewLink from './_components/interviewLink'

export default function CreateInterview() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    jobPosition: '',
    jobDescription: '',
    duration: '30',
    selectedTypes: []
  });
  const [interviewId, setInterviewId] = useState(null);

  console.log('📄 PAGE.JSX - Current step:', step);
  console.log('📄 PAGE.JSX - Form data:', formData);

  const onHandleInputChange = (data) => {
    console.log('📄 PAGE.JSX - onHandleInputChange called:', data);
    setFormData(prevData => ({
      ...prevData,
      ...data
    }));
  };

  const onGoToNext = () => {
    console.log('📄 PAGE.JSX - onGoToNext called! Moving to step', step + 1);
    setStep(step + 1);
  };

  const onGoBack = () => {
    console.log('📄 PAGE.JSX - onGoBack called! Moving to step', step - 1);
    setStep(step - 1);
  };

  const onCreateInterviewLink = (id) => {
    console.log('📄 PAGE.JSX - onCreateInterviewLink called:', id);
    setInterviewId(id);
    setStep(3);
  };

  const onBackToDashboard = () => {
    console.log('📄 PAGE.JSX - onBackToDashboard called! Moving to step 1');
    setStep(1);
  };

  return (
    <div className="container py-8 mx-auto">
      {(() => {
        console.log('📄 PAGE.JSX - Rendering component for step:', step);
        console.log('📄 PAGE.JSX - Form data:', formData);
        
        if (step === 1) {
          console.log('📄 PAGE.JSX - Rendering FormContainer');
          return (
            <FormContainer 
              onHandleInputChange={onHandleInputChange}
              GoToNext={onGoToNext}
            />
          );
        } else if (step === 2) {
          console.log('📄 PAGE.JSX - Rendering QuestionList with data:', formData);
          return (
            <QuestionList 
              formData={formData}
              GoBack={onGoBack}
              onCreateInterviewLink={onCreateInterviewLink}
            />
          );
        } else if (step === 3) {
          console.log('📄 PAGE.JSX - Rendering InterviewLink with id:', interviewId);
          return (
            <InterviewLink 
              interviewId={interviewId}
              formData={formData}
              onBack={onBackToDashboard}
            />
          );
        } else {
          console.log('📄 PAGE.JSX - No component to render for step:', step);
          return null;
        }
      })()}
    </div>
  )
} 