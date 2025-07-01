'use client';

import React, { useState } from 'react'
import FormContainer from './_components/FormContainer'
import QuestionList from './_components/QuestionList'

function CreateInterview() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  console.log('📄 PAGE.JSX - Current step:', step);
  console.log('📄 PAGE.JSX - Form data:', formData);

  const onHandleInputChange = (field, value) => {
    console.log('📄 PAGE.JSX - onHandleInputChange called:', field, '=', value);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const onGoToNext = () => {
    console.log('📄 PAGE.JSX - onGoToNext called! Moving to step 2');
    setStep(2);
  };

  const onGoBack = () => {
    console.log('📄 PAGE.JSX - onGoBack called! Moving to step 1');
    setStep(1);
  };

  return (
    <div>
      {(() => {
        console.log('📄 PAGE.JSX - Rendering component for step:', step);
        if (step == 1) {
          console.log('📄 PAGE.JSX - Rendering FormContainer');
          return (
            <FormContainer 
              onHandleInputChange={onHandleInputChange}
              GoToNext={onGoToNext}
            />
          );
                 } else if (step == 2) {
           console.log('📄 PAGE.JSX - Rendering QuestionList with data:', formData);
           return <QuestionList formData={formData} GoBack={onGoBack} />;
         } else {
          console.log('📄 PAGE.JSX - No component to render for step:', step);
          return null;
        }
      })()}
    </div>
  )
}

export default CreateInterview 