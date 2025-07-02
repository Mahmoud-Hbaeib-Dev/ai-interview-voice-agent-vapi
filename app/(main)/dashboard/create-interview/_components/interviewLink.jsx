'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  CheckCircle2Icon, 
  CopyIcon, 
  Clock, 
  ListChecks, 
  Calendar, 
  Briefcase, 
  FileText,
  AlertCircle,
  Share2,
  QrCode,
  Eye,
  EyeOff,
  Mail,
  X,
  Send,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import QRCode from 'qrcode.react';

const InterviewLink = ({ interviewId, formData, onBack }) => {
  const [showQR, setShowQR] = useState(false);
  const [isLinkVisible, setIsLinkVisible] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const interviewLink = `${window.location.origin}/interview/${interviewId}`;
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 30);

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!recipientEmail) {
      toast.error('Please enter recipient email');
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: recipientEmail,
          subject: `Interview Invitation for ${formData.jobPosition} Position`,
          position: formData.jobPosition,
          duration: formData.duration,
          questions: formData.questionList?.length || 10,
          expirationDate: expirationDate.toLocaleDateString(),
          interviewLink: interviewLink
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', response.status, errorText);
        throw new Error(`Server error: ${response.status} ${errorText || response.statusText}`);
      }

      const data = await response.json();

      toast.success('Email sent successfully!', {
        description: `Invitation sent to ${recipientEmail}`,
      });
      setShowEmailModal(false);
      setRecipientEmail('');
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send email', {
        description: error.message || 'Please try again or copy the link manually',
      });
    } finally {
      setIsSending(false);
    }
  };

  const copyToClipboard = () => { 
    navigator.clipboard.writeText(interviewLink);
    toast.success('Link copied to clipboard!', {
      description: 'You can now share it with your candidate',
    });
  };

  return (
    <div className="mx-auto mt-8 max-w-3xl">
      {/* Progress Bar */}
      <Card className="mb-8 border-none shadow-sm">
        <div className="px-6 pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-gray-700">Progress</span>
              <span className="text-blue-600">100%</span>
            </div>
            <Progress value={100} className="h-2" />
            <div className="flex justify-between text-xs text-gray-500">
              <span className="">Job Details</span>
              <span className="">Interview Setup</span>
              <span className="font-medium text-blue-600">Generate</span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-8 border-none shadow-lg">
        <div className="flex justify-center items-center mb-6">
          <div className="p-3 bg-green-100 rounded-full">
            <CheckCircle2Icon className="w-12 h-12 text-green-500" />
          </div>
        </div>
        <h2 className="mb-2 text-3xl font-bold text-center text-gray-900">Interview Created Successfully!</h2>
        <p className="mb-8 text-lg text-center text-gray-600">
          Your AI-powered interview is ready to be shared
        </p>
        
        {/* Interview Details */}
        <div className="grid gap-6 mb-8 md:grid-cols-2">
          {/* Job Information */}
          <div className="p-4 bg-blue-50 rounded-lg hover:shadow-md">
            <h3 className="flex items-center mb-3 font-semibold text-blue-900">
              <Briefcase className="mr-2 w-5 h-5" />
              Job Details
            </h3>
            <div className="space-y-2 text-sm">
              <div className="text-blue-800">
                <strong>Position:</strong> {formData.jobPosition}
              </div>
              <div className="text-blue-800">
                <strong>Description:</strong>
                <p className="mt-1 text-blue-700 line-clamp-2">{formData.jobDescription}</p>
              </div>
            </div>
          </div>

          {/* Interview Settings */}
          <div className="p-4 bg-purple-50 rounded-lg hover:shadow-md">
            <h3 className="flex items-center mb-3 font-semibold text-purple-900">
              <FileText className="mr-2 w-5 h-5" />
              Interview Settings
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-purple-800">
                <Clock className="mr-2 w-4 h-4" />
                <span>Duration: {formData.duration} minutes</span>
              </div>
              <div className="flex items-center text-purple-800">
                <ListChecks className="mr-2 w-4 h-4" />
                <span>Questions: {formData.questionList?.length || 10} questions</span>
              </div>
              <div className="flex items-center text-purple-800">
                <Calendar className="mr-2 w-4 h-4" />
                <span>Expires: {expirationDate.toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Share Link Section */}
        <div className="p-6 mb-8 bg-gray-50 rounded-lg">
          <h3 className="flex justify-center items-center mb-4 font-semibold text-gray-900">
            <Share2 className="mr-2 w-5 h-5" />
            Share Interview Link
          </h3>
          <div className="flex gap-2 items-center mb-4">
            <div className="relative flex-1">
              <input
                type="text"
                value={isLinkVisible ? interviewLink : '•'.repeat(40)}
                readOnly
                className="p-3 pr-10 w-full bg-white rounded-lg border outline-none"
              />
              <button
                onClick={() => setIsLinkVisible(!isLinkVisible)}
                className="absolute right-3 top-1/2 text-gray-500 transform -translate-y-1/2 hover:text-gray-700"
              >
                {isLinkVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={copyToClipboard}
                    className="px-6 text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <CopyIcon className="mr-2 w-4 h-4" />
                    Copy
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy link to clipboard</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex gap-3 justify-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() => setShowQR(!showQR)}
                    className="text-gray-700"
                  >
                    <QrCode className="mr-2 w-4 h-4" />
                    {showQR ? 'Hide QR' : 'Show QR'}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle QR code visibility</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() => setShowEmailModal(true)}
                    className="text-gray-700"
                  >
                    <Mail className="mr-2 w-4 h-4" />
                    Share via Email
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Send interview invitation via email</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {showQR && (
            <div className="flex flex-col items-center mt-4">
              <QRCode
                value={interviewLink}
                size={200}
                level="H"
                includeMargin
                className="mb-3"
              />
            </div>
          )}
        </div>

        {/* Important Note */}
        <div className="p-4 mb-8 bg-amber-50 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-amber-600 mr-2 mt-0.5" />
            <div className="text-sm text-amber-800">
              <strong>Important Note:</strong>
              <ul className="mt-1 ml-4 list-disc text-amber-700">
                <li>This link will expire in 30 days</li>
                <li>The interview can only be taken once per candidate</li>
                <li>Make sure to share the link with the intended candidate only</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={onBack}
                  className="px-8 py-2 text-base hover:bg-gray-100"
                >
                  Back to Dashboard
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Return to your dashboard</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </Card>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="flex fixed inset-0 z-50 justify-center items-center bg-black/50">
          <Card className="p-6 m-4 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Send Interview Invitation</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowEmailModal(false)}
                className="w-8 h-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <form onSubmit={handleSendEmail} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="recipientEmail">Recipient Email</Label>
                <Input
                  id="recipientEmail"
                  type="email"
                  placeholder="Enter recipient's email address"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              <div className="p-4 space-y-2 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium">Email Preview</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><strong>Position:</strong> {formData.jobPosition}</p>
                  <p><strong>Duration:</strong> {formData.duration} minutes</p>
                  <p><strong>Questions:</strong> {formData.questionList?.length || 10}</p>
                  <p><strong>Expires:</strong> {expirationDate.toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowEmailModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="text-white bg-blue-600 hover:bg-blue-700"
                  disabled={isSending}
                >
                  {isSending ? (
                    <>
                      <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 w-4 h-4" />
                      Send Invitation
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default InterviewLink;
