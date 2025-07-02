import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

function QuestionListContainer({ questionList }) {
  return (
    <div className="space-y-4">
      {questionList && questionList.map((question, index) => (
        <Card key={index} className="border-none shadow-sm transition-shadow hover:shadow-md">
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {question.type}
                </span>
                <span className="text-sm text-gray-500">Question {index + 1}</span>
              </div>
              <p className="text-lg text-gray-800">{question.question}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default QuestionListContainer; 