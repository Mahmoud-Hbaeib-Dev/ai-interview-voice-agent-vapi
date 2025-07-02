import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2Icon, CopyIcon } from 'lucide-react';
import { toast } from 'sonner';

function InterviewLink({ interviewId, onBack }) {
  const interviewLink = `${window.location.origin}/interview/${interviewId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(interviewLink);
    toast.success('Link copied to clipboard!');
  };

  return (
    <div className="mx-auto mt-8 max-w-2xl">
      <Card className="p-6">
        <div className="flex justify-center items-center mb-4">
          <CheckCircle2Icon className="w-12 h-12 text-green-500" />
        </div>
        <h2 className="mb-4 text-2xl font-bold text-center">Interview Created Successfully!</h2>
        <p className="mb-6 text-center text-gray-600">
          Share this link with your candidate to start the interview:
        </p>
        <div className="flex gap-2 items-center p-3 mb-6 bg-gray-50 rounded-lg">
          <input
            type="text"
            value={interviewLink}
            readOnly
            className="flex-1 bg-transparent outline-none"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={copyToClipboard}
            className="hover:bg-gray-100"
          >
            <CopyIcon className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={onBack}
            className="px-6"
          >
            Back to Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default InterviewLink;
