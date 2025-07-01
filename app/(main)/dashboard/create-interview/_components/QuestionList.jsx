import { Loader2Icon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import axios from 'axios';

function QuestionList({formData}) {

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
    <div>
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
  )
}

export default QuestionList
