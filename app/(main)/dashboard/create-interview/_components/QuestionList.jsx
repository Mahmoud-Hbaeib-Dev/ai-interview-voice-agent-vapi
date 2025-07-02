import { Loader2Icon, ArrowLeft, RefreshCw } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import axios from 'axios';
import QuestionListContainer from './questionListContainer';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '../../../provider';

function QuestionList({formData, GoBack, onCreateInterviewLink}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [questionList, setQuestionList] = useState([]);
  const user = useUser(); // Get user data from context
  const [saveLoading, setSaveLoading] = useState(false);

  
  useEffect(() => {
    if (formData) {
      GeneralQuestionList();
    }
  },[formData])

  const GeneralQuestionList = async () => {
    setLoading(true);
    setError(null);
    try {
      // Validate required fields
      if (!formData.jobPosition || !formData.jobDescription || !formData.selectedTypes) {
        throw new Error("Missing required fields: job position, description, or interview types");
      }

      const result = await axios.post("/api/ai-model", {
        jobPosition: formData.jobPosition,
        jobDescription: formData.jobDescription,
        selectedTypes: formData.selectedTypes,
        duration: formData.duration || "30" // Default to 30 minutes if not specified
      });
      
      if (result.data.error) {
        throw new Error(result.data.details || result.data.error);
      }
      
      console.log("API Response:", result.data);
      
      if (!result.data.interviewQuestions || !Array.isArray(result.data.interviewQuestions)) {
        throw new Error("Invalid response format: missing questions array");
      }
      
      setQuestionList(result.data.interviewQuestions);
      setLoading(false);
    }
    catch (e) {
      const errorMessage = e.response?.data?.details || e.response?.data?.error || e.message;
      setError(errorMessage);
      toast.error(`Error: ${errorMessage}`);
      setLoading(false);
      console.error("Error details:", {
        message: e.message,
        response: e.response?.data,
        error: e
      });
    }
  }

  const onFinish = async () => {
    setSaveLoading(true);
    try {
      if (!user || !user.email) {
        toast.error("User email not available");
        return;
      }

      const interview_id = uuidv4();
      
      // Transform the data to match database schema
      const transformedFormData = {
        ...formData,
        type: formData.selectedTypes.join(', '), // Convert array to string
        duration: `${formData.duration} minutes`, // Save duration with 'minutes' text
      };
      // Remove the selectedTypes field since we converted it to type
      delete transformedFormData.selectedTypes;

      const { data, error } = await supabase
        .from('Interviews')
        .insert([
          { 
            ...transformedFormData,
            questionList: questionList,
            userEmail: user.email, // Use email from user context
            interview_id: interview_id,
            created_at: new Date().toISOString(),
          },
        ])
        .select();

      setSaveLoading(false);
        
      onCreateInterviewLink(interview_id);
      
      
      if (error) {
        toast.error("Failed to save interview");
        console.error("Error saving interview:", error);
        return;
      }

      toast.success("Interview created successfully!");
      console.log("Interview saved:", data);
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Error in onFinish:", error);
    }
  }

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={GoBack}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Form
          </Button>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Generate Interview Questions</h1>
            <p className="text-gray-600">AI is creating personalized questions based on your requirements</p>
          </div>
        </div>

        {/* Progress Bar */}
        <Card className="mb-8 border-none shadow-sm">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-gray-700">Progress</span>
                <span className="text-blue-600">66%</span>
              </div>
              <Progress value={66} className="h-2" />
              <div className="flex justify-between text-xs text-gray-500">
                <span className="">Job Details</span>
                <span className="font-medium text-blue-600">Interview Setup</span>
                <span className="">Generate</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading/Content Area */}
        {loading && (
          <Card className="bg-blue-50 border-none shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <Loader2Icon className="w-5 h-5 text-blue-600 animate-spin" />
                <div>
                  <h3 className="font-medium text-blue-900">Generating Interview Questions</h3>
                  <p className="text-sm text-blue-700">Our AI is crafting personalized questions based on your requirements...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && !loading && (
          <Card className="mb-4 bg-red-50 border-none shadow-sm">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div>
                    <h3 className="font-medium text-red-900">Failed to Generate Questions</h3>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
                <Button
                  onClick={GeneralQuestionList}
                  variant="ghost"
                  className="text-red-600 hover:text-red-700"
                >
                  <RefreshCw className="mr-2 w-4 h-4" />
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Questions List */}
        {!loading && !error && <QuestionListContainer questionList={questionList} />}
        
        {/* Finish Button */}
        {questionList && questionList.length > 0 && !loading && !error && (
          <div className="flex justify-center mt-6">
            <Button 
              onClick={() => onFinish()} 
              disabled={saveLoading}
              className="px-8 text-white bg-blue-600 hover:bg-blue-700"
            >
              Create Interview Link & Finish
              {saveLoading && <Loader2Icon className="ml-2 w-4 h-4 animate-spin" />}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default QuestionList
