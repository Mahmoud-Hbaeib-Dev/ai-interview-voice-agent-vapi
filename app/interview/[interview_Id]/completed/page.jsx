'use client'
import React, { useContext } from 'react'
import { InterviewDataContext } from '@/context/InterviewDataContext'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  CheckCircle, 
  Clock, 
  Mail,
  Home,
  Award
} from 'lucide-react'

function InterviewCompleted() {
  const { interviewInfo } = useContext(InterviewDataContext);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-8 px-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        
        {/* Success Icon */}
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>

        {/* Main Message */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            Interview Completed Successfully!
          </h1>
          <p className="text-xl text-gray-600">
            Thank you, <span className="font-semibold text-blue-600">{interviewInfo?.userName || 'Candidate'}</span>
          </p>
          <p className="text-gray-500">
            Position: {interviewInfo?.interviewData?.jobPosition || 'N/A'}
          </p>
        </div>

        {/* Thank You Card */}
        <Card className="p-8 bg-white shadow-lg">
          <div className="space-y-6">
            <div className="flex items-center justify-center">
              <Award className="w-8 h-8 text-blue-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">
                Thank You for Your Time
              </h2>
            </div>
            
            <p className="text-gray-600 leading-relaxed">
              We appreciate you taking the time to interview with us. Your responses have been recorded 
              and our team will carefully review your interview.
            </p>
          </div>
        </Card>

        {/* Next Steps */}
        <Card className="p-6 bg-blue-50 border border-blue-200">
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600 mr-2" />
              <h3 className="text-xl font-semibold text-blue-800">What Happens Next?</h3>
            </div>
            
            <div className="space-y-3 text-blue-700">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p>Our hiring team will review your interview within the next 2-3 business days</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p>You will receive an email update regarding the next steps in the process</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p>Please check your email regularly, including your spam folder</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Contact Info */}
        <Card className="p-6 bg-gray-50">
          <div className="flex items-center justify-center mb-4">
            <Mail className="w-6 h-6 text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Questions?</h3>
          </div>
          <p className="text-gray-600">
            If you have any questions about the interview process or need to update your contact information, 
            please reach out to our HR team.
          </p>
        </Card>



        {/* Footer Message */}
        <div className="text-center text-gray-500 text-sm pt-8">
          <p>Thank you for your interest in joining our team!</p>
          <p className="mt-1">We look forward to potentially working with you.</p>
        </div>
      </div>
    </div>
  );
}

export default InterviewCompleted;
