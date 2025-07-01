import { Loader2Icon, ArrowLeft } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import axios from 'axios';

function QuestionList({formData, GoBack}) {

  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (formData) {
      GeneralQuestionList();
    }
  },[formData])


  const GeneralQuestionList = async () => {
    setLoading(true);
    try{
    const result = await axios.post("/api/ai-model", {
     ...formData,
    }
    )
      console.log(result.data);
      setLoading(false);
    }
    catch (e) {
      toast.error("Error generating questions, please try again");
      setLoading(false);
      console.log(e);
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
      </div>
    </div>
  )
}

export default QuestionList
