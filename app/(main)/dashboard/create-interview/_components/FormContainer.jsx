'use client';

import React, { useState } from 'react';
import { ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InterviewType } from '../../../../../service/constant';
import { toast } from 'sonner';

function FormContainer({ onHandleInputChange, GoToNext }) {
    const router = useRouter();
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [formData, setFormData] = useState({
        jobPosition: '',
        jobDescription: '',
        duration: '15'
    });

    console.log('🔷 FORM CONTAINER - Props received:', { onHandleInputChange: !!onHandleInputChange, GoToNext: !!GoToNext });
    console.log('🔷 FORM CONTAINER - Current formData:', formData);
    console.log('🔷 FORM CONTAINER - Selected types:', selectedTypes);
    console.log('🔷 FORM CONTAINER - Is generating:', isGenerating);

    // Fixed progress for step 1
    const progress = 33.33;

    const handleTypeToggle = (type) => {
        console.log('🔷 FORM CONTAINER - handleTypeToggle called for:', type);
        setSelectedTypes(prev => {
            const newTypes = prev.includes(type) 
                ? prev.filter(t => t !== type)
                : [...prev, type];
            console.log('🔷 FORM CONTAINER - New selected types:', newTypes);
            return newTypes;
        });
    };

    const handleInputChange = (field, value) => {
        console.log('🔷 FORM CONTAINER - handleInputChange called:', field, '=', value);
        const newFormData = {
            ...formData,
            [field]: value
        };
        setFormData(newFormData);
        
        // Also call parent's onHandleInputChange with complete form data
        if (onHandleInputChange) {
            console.log('🔷 FORM CONTAINER - Calling parent onHandleInputChange with complete data');
            onHandleInputChange(newFormData);
        } else {
            console.log('🔷 FORM CONTAINER - No parent onHandleInputChange function provided!');
        }
    };

    const handleGenerateQuestions = async () => {
        console.log('🔷 FORM CONTAINER - handleGenerateQuestions called!');
        console.log('🔷 FORM CONTAINER - Form validation check:');
        console.log('  - Job Position:', formData.jobPosition);
        console.log('  - Job Description:', formData.jobDescription);
        console.log('  - Selected Types:', selectedTypes);

        if (!formData.jobPosition || !formData.jobDescription || selectedTypes.length === 0) {
            console.log('🔷 FORM CONTAINER - Validation FAILED! Showing toast.');
            toast('Please enter all details!');
            return;
        }

        console.log('🔷 FORM CONTAINER - Validation PASSED! Starting generation...');
        setIsGenerating(true);

        // Pass complete form data including selected types to parent
        if (onHandleInputChange) {
            console.log('🔷 FORM CONTAINER - Passing complete data to parent');
            onHandleInputChange({
                ...formData,
                selectedTypes
            });
        } else {
            console.log('🔷 FORM CONTAINER - No onHandleInputChange function to pass data!');
        }

        // Simulate API call then go to next step
        console.log('🔷 FORM CONTAINER - Starting 2 second timer...');
        setTimeout(() => {
            console.log('🔷 FORM CONTAINER - Timer finished! Calling GoToNext...');
            setIsGenerating(false);
            if (GoToNext) {
                console.log('🔷 FORM CONTAINER - GoToNext function exists, calling it now!');
                GoToNext();
            } else {
                console.log('🔷 FORM CONTAINER - ERROR: No GoToNext function provided!');
            }
        }, 2000);
    };

    const canProceed = () => {
        const canProceedResult = formData.jobPosition && formData.jobDescription && selectedTypes.length > 0;
        console.log('🔷 FORM CONTAINER - canProceed check:', canProceedResult);
        return canProceedResult;
    };

    return (
        <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            <div className="mx-auto max-w-4xl">
                {/* Header */}
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="mb-4 text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="mr-2 w-4 h-4" />
                        Back to Dashboard
                    </Button>
                    
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-gray-900">Create New Interview</h1>
                        <p className="text-gray-600">Set up an AI-powered interview tailored to your requirements</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <Card className="mb-8 border-none shadow-sm">
                    <CardContent className="pt-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-medium">
                                <span className="text-gray-700">Progress</span>
                                <span className="text-blue-600">{Math.round(progress)}%</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                            <div className="flex justify-between text-xs text-gray-500">
                                <span className="font-medium text-blue-600">Job Details</span>
                                <span className="">Interview Setup</span>
                                <span className="">Generate</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Form */}
                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Form Fields */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Job Position */}
                        <Card className="border-none shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Job Position</CardTitle>
                                <CardDescription>Enter the role you're hiring for</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Input
                                    placeholder="e.g. Senior Frontend Developer"
                                    value={formData.jobPosition}
                                    onChange={(e) => handleInputChange('jobPosition', e.target.value)}
                                    className="text-base"
                                />
                            </CardContent>
                        </Card>

                        {/* Job Description */}
                        <Card className="border-none shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Job Description</CardTitle>
                                <CardDescription>Provide detailed requirements and responsibilities</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Textarea
                                    placeholder="Enter detailed job description including required skills, experience level, technologies, and key responsibilities..."
                                    value={formData.jobDescription}
                                    onChange={(e) => handleInputChange('jobDescription', e.target.value)}
                                    className="text-base resize-none min-h-32"
                                />
                            </CardContent>
                        </Card>

                        {/* Interview Duration */}
                        <Card className="border-none shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Interview Duration</CardTitle>
                                <CardDescription>How long should the interview take?</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Select value={formData.duration} onValueChange={(value) => handleInputChange('duration', value)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="10">10 minutes</SelectItem>
                                        <SelectItem value="15">15 minutes</SelectItem>
                                        <SelectItem value="20">20 minutes</SelectItem>
                                        <SelectItem value="30">30 minutes</SelectItem>
                                        <SelectItem value="45">45 minutes</SelectItem>
                                        <SelectItem value="60">60 minutes</SelectItem>
                                    </SelectContent>
                                </Select>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Interview Types Selection */}
                    <div className="space-y-6">
                        <Card className="border-none shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Interview Types</CardTitle>
                                <CardDescription>Select the areas you want to assess</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {InterviewType.map((type, index) => {
                                    const Icon = type.icon;
                                    const isSelected = selectedTypes.includes(type.title);
                                    
                                    return (
                                        <div
                                            key={index}
                                            onClick={() => handleTypeToggle(type.title)}
                                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                                isSelected 
                                                    ? 'bg-blue-50 border-blue-500 shadow-sm' 
                                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            <div className="flex items-start space-x-3">
                                                <div className={`p-2 rounded-lg ${
                                                    isSelected ? 'bg-blue-100' : 'bg-gray-100'
                                                }`}>
                                                    <Icon className={`h-4 w-4 ${
                                                        isSelected ? 'text-blue-600' : 'text-gray-600'
                                                    }`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-center">
                                                        <h4 className={`font-medium text-sm ${
                                                            isSelected ? 'text-blue-900' : 'text-gray-900'
                                                        }`}>
                                                            {type.title}
                                                        </h4>
                                                        {isSelected && (
                                                            <Badge variant="secondary" className="ml-2 text-blue-700 bg-blue-100">
                                                                Selected
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="mt-1 text-xs text-gray-600">
                                                        {type.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>

                        {/* Selected Types Summary */}
                        {selectedTypes.length > 0 && (
                            <Card className="bg-green-50 border-none shadow-sm">
                                <CardContent className="pt-4">
                                    <div className="flex items-center mb-3 space-x-2">
                                        <Sparkles className="w-4 h-4 text-green-600" />
                                        <span className="text-sm font-medium text-green-800">
                                            {selectedTypes.length} type{selectedTypes.length > 1 ? 's' : ''} selected
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {selectedTypes.map((type, index) => (
                                            <Badge key={index} variant="secondary" className="text-green-700 bg-green-100">
                                                {type}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between mt-8">
                    <Button variant="outline" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleGenerateQuestions}
                        disabled={!canProceed() || isGenerating}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 w-4 h-4" />
                                Generate Questions
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default FormContainer;
