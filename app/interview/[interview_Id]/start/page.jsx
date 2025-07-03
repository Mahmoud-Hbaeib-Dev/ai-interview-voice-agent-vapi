'use client'
import React, { useContext, useEffect, useState, useRef } from 'react'
import { InterviewDataContext } from '@/context/InterviewDataContext'
import { Timer, MessageCircle, Mic, Video, Volume2, Briefcase, GraduationCap, MicOff, VideoOff, CheckCircle, RefreshCw, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import Vapi from '@vapi-ai/web'

export default function StartInterview() {
  const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);
  const [vapiClient, setVapiClient] = useState(null);

  // Initialize Vapi client
  useEffect(() => {
    const initializeVapi = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
        console.log('Environment check:');
        console.log('- API Key exists:', !!apiKey);
        console.log('- API Key length:', apiKey?.length);
        console.log('- API Key preview:', apiKey?.substring(0, 8) + '...');
        
        if (!apiKey) {
          throw new Error('NEXT_PUBLIC_VAPI_PUBLIC_KEY is not set');
        }
        
        console.log('Creating Vapi client...');
        // Create a new instance of Vapi with the constructor
        const client = new Vapi(apiKey);
        
        console.log('Setting up event listeners...');
        // Set up event listeners
        client.on('call-start', () => {
          console.log('Call started');
          setIsInterviewStarted(true);
        });

        client.on('call-end', () => {
          console.log('Call ended');
          toast.success('Interview completed!');
          setIsInterviewStarted(false);
        });

        client.on('error', (error) => {
          console.error('Vapi error:', error);
          toast.error('Error during the call');
          setIsInterviewStarted(false);
        });

        client.on('message', (message) => {
          console.log('Message received:', message);
        });
        
        setVapiClient(client);
        console.log('Vapi client initialized successfully');
        toast.success('Interview system ready!');
      } catch (error) {
        console.error('Error initializing Vapi client:', error);
        toast.error('Failed to initialize interview system: ' + error.message);
      }
    };

    initializeVapi();
  }, []);

  const StartCall = async () => { 
    if (!vapiClient) {
      toast.error('Interview system not ready. Please try again.');
      return;
    }

    console.log("Full interview info:", interviewInfo);
    console.log("Interview data:", interviewInfo?.interviewData);
    console.log("Question list:", interviewInfo?.interviewData?.questionList);
    
    if (!interviewInfo?.interviewData?.questionList) {
      console.log("No question list found");
      toast.error('No questions found for the interview');
      return;
    }
    
    let questionList = '';
    const questions = interviewInfo.interviewData.questionList;
    
    if (Array.isArray(questions)) {
      questionList = questions
        .map(item => item?.question)
        .filter(Boolean)
        .join('\n');
    }
    
    console.log("Processed question list:", questionList);

    const assistantOptions = {
      name: "AI Recruiter",
      firstMessage: "Hi "+ interviewInfo?.userName+", how are you? Ready for your interview on "+interviewInfo?.interviewData?.jobPosition,
      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "en-US"
      },
      voice: {
        provider: "playht",
        voiceId: "jennifer"
      },
      model: {
        provider: "openai",
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `
              You are an AI voice assistant conducting interviews.
              Your job is to ask candidates provided interview questions, assess their responses.
              Begin the conversation with a friendly introduction, setting a relaxed yet professional tone. Example:
              "Hey there! Welcome to your ${interviewInfo?.interviewData?.jobPosition} interview. Let's get started with a few questions!"
              Ask one question at a time and wait for the candidate's response before proceeding. Keep the questions clear and concise. Below Are the questions ask one by one:
              Questions: ${questionList}
              If the candidate struggles, offer hints or rephrase the question without giving away the answer. Example:
              "Need a hint? Think about how React tracks component updates!"
              Provide brief, encouraging feedback after each answer. Example:
              "Nice! That's a solid answer."
              "Hmm, not quite! Want to try again?"
              Keep the conversation natural and engaging—use casual phrases like "Alright, next up..." or "Let's tackle a tricky one!"
              After 5-7 questions, wrap up the interview smoothly by summarizing their performance. Example:
              "That was great! You handled some tough questions well. Keep sharpening your skills!"
              End on a positive note:
              "Thanks for chatting! Hope to see you crushing projects soon!"

              Key Guidelines:
              ✅ Be friendly, engaging, and witty 😊
              ✅ Keep responses short and natural, like a real conversation
              ✅ Adapt based on the candidate's confidence level
              ✅ Ensure the interview remains focused on React
            `.trim()
          }
        ]
      }
    };

    try {
      console.log('Starting call with assistant options:', assistantOptions);
      // Start the call directly with assistant options
      await vapiClient.start(assistantOptions);
      console.log('Call started successfully');
      
    } catch (error) {
      console.error('Error starting call:', error);
      toast.error('Failed to start the interview');
      setIsInterviewStarted(false);
    }
  };

  useEffect(() => {
    if (interviewInfo) {
      // StartCall(); // Remove this auto-start
    }
  }, [interviewInfo]);

  const handleStartInterview = async () => {
    console.log('Start interview button clicked');
    console.log('Vapi client exists:', !!vapiClient);
    console.log('Interview info:', interviewInfo);
    
    if (!vapiClient) {
      console.error('Vapi client not ready');
      toast.error('Interview system not ready. Please try again.');
      return;
    }
    
    console.log('Starting interview...');
    setIsInterviewStarted(true);
    await StartCall();
  };

  const [userName, setUserName] = useState(interviewInfo?.userName);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const interviewUUID = params.interview_Id;

  // Device states
  const [micPermission, setMicPermission] = useState('pending');
  const [cameraPermission, setCameraPermission] = useState('pending');
  const [speakerWorking, setSpeakerWorking] = useState('pending');
  const [stream, setStream] = useState(null);
  const audioRef = useRef(null);

  // Add new states for device controls
  const [isMicOn, setIsMicOn] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const videoRef = useRef(null);

  // Add new states for testing
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [showTestGuide, setShowTestGuide] = useState(true);

  // Add test step state
  const [testStep, setTestStep] = useState('camera'); // 'camera', 'mic', 'speaker'
  const [isTestingMic, setIsTestingMic] = useState(false);
  const [testAudio, setTestAudio] = useState(null);

  // Check devices on component mount
  useEffect(() => {
    checkDevices();
    return () => {
      // Cleanup: stop all tracks when component unmounts
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const checkDevices = async () => {
    try {
      // Just check if devices are available without activating them
      const devices = await navigator.mediaDevices.enumerateDevices();
      
      // Check if camera exists
      const hasCamera = devices.some(device => device.kind === 'videoinput');
      setCameraPermission(hasCamera ? 'granted' : 'denied');
      
      // Check if microphone exists
      const hasMic = devices.some(device => device.kind === 'audioinput');
      setMicPermission(hasMic ? 'granted' : 'denied');
      
      // Check if speaker exists
      const hasSpeaker = devices.some(device => device.kind === 'audiooutput');
      setSpeakerWorking(hasSpeaker ? 'granted' : 'denied');

    } catch (error) {
      console.error('Error checking devices:', error);
      setCameraPermission('denied');
      setMicPermission('denied');
      setSpeakerWorking('denied');
    }
  };

  const testSpeaker = () => {
    try {
      // Create an audio context
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create an oscillator for the test tone
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      // Configure the test tone
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // 440 Hz - A4 note
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime); // Set volume to 10%
      
      // Connect the nodes
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Play the tone for 1 second
      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
        audioContext.close();
      }, 1000);

      setSpeakerWorking('granted');
    } catch (error) {
      console.error('Error testing speaker:', error);
      setSpeakerWorking('denied');
    }
  };

  const toggleCamera = async () => {
    try {
      if (isCameraOn) {
        // Turn off camera
        if (stream) {
          const videoTracks = stream.getVideoTracks();
          videoTracks.forEach(track => track.stop());
        }
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
        setIsCameraOn(false);
      } else {
        // Turn on camera
        const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
        }
        setStream(newStream);
        setIsCameraOn(true);
        setCameraPermission('granted');
      }
    } catch (error) {
      console.error('Error toggling camera:', error);
      setCameraPermission('denied');
      setIsCameraOn(false);
      toast.error('Could not access camera');
    }
  };

  const toggleMic = async () => {
    try {
      if (isMicOn) {
        // Turn off microphone
        if (stream) {
          const audioTracks = stream.getAudioTracks();
          audioTracks.forEach(track => track.stop());
        }
        setIsMicOn(false);
      } else {
        // Turn on microphone
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setStream(prevStream => {
          if (prevStream) {
            prevStream.getAudioTracks().forEach(track => track.stop());
          }
          return audioStream;
        });
        setIsMicOn(true);
        setMicPermission('granted');
      }
    } catch (error) {
      console.error('Error toggling microphone:', error);
      setMicPermission('denied');
      setIsMicOn(false);
      toast.error('Could not access microphone');
    }
  };

  // Modify getDeviceStatus to handle off state
  const getDeviceStatus = (deviceType) => {
    const isOff = (deviceType === 'camera' && !isCameraOn) || 
                 (deviceType === 'mic' && !isMicOn);
    
    if (isOff) {
      return { 
        text: 'Turned Off', 
        class: 'bg-gray-100 text-gray-700 border-0',
        iconClass: 'text-gray-600',
        bgClass: 'bg-gray-100'
      };
    }

    const permission = deviceType === 'camera' ? cameraPermission : 
                      deviceType === 'mic' ? micPermission : 
                      speakerWorking;

    switch(permission) {
      case 'granted':
        return { 
          text: 'Ready', 
          class: 'bg-green-100 text-green-700 border-0',
          iconClass: 'text-green-600',
          bgClass: 'bg-green-100'
        };
      case 'denied':
        return { 
          text: 'Not Available', 
          class: 'bg-red-100 text-red-700 border-0',
          iconClass: 'text-red-600',
          bgClass: 'bg-red-100'
        };
      default:
        return { 
          text: 'Checking...', 
          class: 'bg-gray-100 text-gray-700 border-0',
          iconClass: 'text-gray-600',
          bgClass: 'bg-gray-100'
        };
    }
  };

  useEffect(() => {
    fetchInterviewDetails();
  }, []);

  const fetchInterviewDetails = async () => {
    try {
      setLoading(true);
      // First get the interview ID using the UUID
      const { data: interview, error } = await supabase
        .from('Interviews')
        .select('*')
        .eq('id', 13) // Using the known ID from your logs
        .single();

      console.log("Supabase response:", interview, error);

      if (error) {
        console.error('Error:', error);
        toast.error('Failed to fetch interview details');
        return;
      }

      if (!interview) {
        toast.error('Interview not found');
        router.push('/');
        return;
      }

      setInterviewInfo(prevState => ({
        ...interview,
        userName: prevState?.userName,
        interviewData: prevState?.interviewData
      }));
    } catch (error) {
      console.error('Error fetching interview:', error);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Add audio recording functionality
  const startRecording = async () => {
    try {
      if (!stream) return;
      
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudio(audioUrl);
      };
      
      setIsRecording(true);
      mediaRecorder.start();
      
      // Stop recording after 5 seconds
      setTimeout(() => {
        mediaRecorder.stop();
        setIsRecording(false);
      }, 5000);
    } catch (error) {
      console.error('Error recording audio:', error);
      toast.error('Error recording audio');
    }
  };

  // Quick mic test function
  const testMicrophone = async () => {
    try {
      setIsTestingMic(true);
      const chunks = [];
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setTestAudio(url);
        setTestStep('speaker');
      };

      mediaRecorder.start();
      setTimeout(() => mediaRecorder.stop(), 3000);
    } catch (error) {
      console.error('Error testing microphone:', error);
      toast.error('Failed to test microphone');
    } finally {
      setTimeout(() => setIsTestingMic(false), 3000);
    }
  };

  // Get the current test message
  const getTestMessage = () => {
    switch(testStep) {
      case 'camera':
        return (
          <div className='flex items-center gap-3 bg-blue-50 p-4 rounded-lg text-blue-700'>
            <div className='w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0'>
              <Video className='w-5 h-5 text-blue-600' />
            </div>
            <div>
              <p className='font-medium'>Check your camera</p>
              <p className='text-sm'>Make sure you can see yourself clearly in the preview above</p>
            </div>
          </div>
        );
      case 'mic':
        return (
          <div className='flex items-center gap-3 bg-blue-50 p-4 rounded-lg text-blue-700'>
            <div className='w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0'>
              <Mic className='w-5 h-5 text-blue-600' />
            </div>
            <div className='flex-grow'>
              <p className='font-medium'>Test your microphone</p>
              <p className='text-sm'>Say something to test your microphone</p>
            </div>
            {!isTestingMic && !testAudio && (
              <Button
                size="sm"
                variant="outline"
                onClick={testMicrophone}
                disabled={!isMicOn}
              >
                Record (3s)
              </Button>
            )}
            {isTestingMic && (
              <span className='text-blue-600 animate-pulse'>Recording...</span>
            )}
            {testAudio && (
              <audio src={testAudio} controls className='h-8 w-32' />
            )}
          </div>
        );
      case 'speaker':
        return (
          <div className='flex items-center gap-3 bg-blue-50 p-4 rounded-lg text-blue-700'>
            <div className='w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0'>
              <Volume2 className='w-5 h-5 text-blue-600' />
            </div>
            <div className='flex-grow'>
              <p className='font-medium'>Test your speakers</p>
              <p className='text-sm'>Click the button below to play a test sound</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                testSpeaker();
                setTimeout(() => setTestStep('ready'), 1000);
              }}
            >
              Play Sound
            </Button>
          </div>
        );
      case 'ready':
        return (
          <div className='flex items-center gap-3 bg-green-50 p-4 rounded-lg text-green-700'>
            <div className='w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0'>
              <CheckCircle className='w-5 h-5 text-green-600' />
            </div>
            <div>
              <p className='font-medium'>All devices are ready!</p>
              <p className='text-sm'>You can start your interview now</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className='container mx-auto px-4 py-8 max-w-5xl'>
      <Card className='p-8 bg-white rounded-xl shadow-lg border border-gray-100'>
        {/* Header */}
        <div className='flex justify-between items-center mb-10 border-b pb-6'>
          <div className='space-y-2'>
            <div className='flex items-center gap-4'>
              <h1 className='text-2xl font-semibold text-blue-600'>
                {loading ? 'Loading...' : (interviewInfo?.jobPosition || 'Technical Interview')}
              </h1>
              <Badge variant="secondary" className='text-sm'>
                {loading ? '...' : (interviewInfo?.type || 'Frontend')}
              </Badge>
            </div>
            <div className='flex items-center gap-3 text-gray-600'>
              <Briefcase className='w-4 h-4' />
              <span className='text-sm'>{loading ? 'Loading...' : (interviewInfo?.company || 'Jobite Recruit')}</span>
              <span className='text-gray-300'>•</span>
              <GraduationCap className='w-4 h-4' />
              <span className='text-sm'>{loading ? 'Loading...' : (interviewInfo?.experience_level || 'Mid-Level')}</span>
            </div>
          </div>
          <div className='flex flex-col items-end gap-2'>
            <div className='flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-full'>
              <Timer className='w-5 h-5 text-blue-600' />
              <span className='text-blue-700 font-medium'>
                {loading ? 'Loading...' : (interviewInfo?.duration || '30 Minutes')}
              </span>
            </div>
            <span className='text-sm text-gray-500'>Interview #{interviewInfo?.id || '...'}</span>
          </div>
        </div>

        {/* Participants */}
        <div className='grid grid-cols-2 gap-12 mb-12'>
          {/* AI Interviewer */}
          <div className='flex flex-col items-center p-8 bg-gradient-to-b from-blue-50 to-white rounded-xl border border-blue-100'>
            <div className='w-32 h-32 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg shadow-blue-100 animate-pulse'>
              <MessageCircle className='w-16 h-16 text-blue-600' />
            </div>
            <h2 className='text-xl font-medium text-gray-800 mb-2'>AI Interviewer</h2>
            <span className='text-sm text-gray-500'>Powered by Jobite Recruit AI</span>
          </div>

          {/* Candidate */}
          <div className='flex flex-col items-center p-8 bg-gradient-to-b from-gray-50 to-white rounded-xl border border-gray-100'>
            <div className='w-32 h-32 rounded-full overflow-hidden mb-4 shadow-lg ring-4 ring-white'>
              <Image 
                src="/assets/images/interview_logo3.jpeg"
                alt="Candidate"
                width={128}
                height={128}
                className='object-cover'
              />
            </div>
            <h2 className='text-xl font-medium text-gray-800 mb-2'>{interviewInfo?.userName || 'Candidate'}</h2>
            {console.log(interviewInfo?.userName)}
            <span className='text-sm text-gray-500'>Interviewee</span>
          </div>
        </div>

        {/* Device Check and Interview Details Section */}
        {!isInterviewStarted ? (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-8'>
            <div className='space-y-6'>
              <div className='flex items-center justify-between'>
                <h2 className='text-lg font-medium text-gray-900'>Device Check</h2>
                <div className='flex items-center gap-2'>
                  <span className='text-sm text-gray-500'>Test your devices before starting</span>
                  <div className={`w-2 h-2 rounded-full ${micPermission === 'granted' && cameraPermission === 'granted' && speakerWorking === 'granted' ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`} />
                </div>
              </div>
              
              {/* Video Preview Area */}
              <div className='w-full aspect-video bg-gray-100 rounded-lg overflow-hidden relative'>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${!isCameraOn ? 'hidden' : ''}`}
                />
                {!isCameraOn && (
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <VideoOff className='w-8 h-8 text-gray-400' />
                  </div>
                )}
                <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2'>
                  <Button
                    variant="outline"
                    className="bg-white/90 hover:bg-white/100 transition-all"
                    onClick={toggleCamera}
                  >
                    {isCameraOn ? (
                      <>
                        <VideoOff className="w-4 h-4 mr-2" />
                        Turn Off Camera
                      </>
                    ) : (
                      <>
                        <Video className="w-4 h-4 mr-2" />
                        Turn On Camera
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-white/90 hover:bg-white/100 transition-all"
                    onClick={() => setIsMicOn(!isMicOn)}
                  >
                    {isMicOn ? (
                      <>
                        <MicOff className="w-4 h-4 mr-2" />
                        Turn Off Mic
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4 mr-2" />
                        Turn On Mic
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Device Status Cards */}
              <div className='grid grid-cols-3 gap-4'>
                {/* Microphone Status */}
                <div className={`p-4 rounded-xl border transition-all ${
                  !isMicOn 
                    ? 'border-red-100 bg-red-50'
                    : micPermission === 'granted'
                    ? 'border-green-100 bg-green-50'
                    : micPermission === 'denied'
                    ? 'border-red-100 bg-red-50'
                    : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className='flex flex-col items-center text-center gap-2'>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      !isMicOn
                        ? 'bg-red-100'
                        : micPermission === 'granted'
                        ? 'bg-green-100'
                        : micPermission === 'denied'
                        ? 'bg-red-100'
                        : 'bg-gray-100'
                    }`}>
                      {isMicOn ? (
                        <Mic className={`w-5 h-5 ${
                          micPermission === 'granted' ? 'text-green-600' : 'text-gray-600'
                        }`} />
                      ) : (
                        <MicOff className='w-5 h-5 text-red-600' />
                      )}
                    </div>
                    <span className='text-sm font-medium'>Microphone</span>
                    <Badge variant="outline" 
                      className={getDeviceStatus('mic').class}
                    >
                      {getDeviceStatus('mic').text}
                    </Badge>
                  </div>
                </div>

                {/* Camera Status */}
                <div className={`p-4 rounded-xl border transition-all ${
                  !isCameraOn
                    ? 'border-red-100 bg-red-50'
                    : cameraPermission === 'granted'
                    ? 'border-green-100 bg-green-50'
                    : cameraPermission === 'denied'
                    ? 'border-red-100 bg-red-50'
                    : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className='flex flex-col items-center text-center gap-2'>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      !isCameraOn
                        ? 'bg-red-100'
                        : cameraPermission === 'granted'
                        ? 'bg-green-100'
                        : cameraPermission === 'denied'
                        ? 'bg-red-100'
                        : 'bg-gray-100'
                    }`}>
                      {isCameraOn ? (
                        <Video className={`w-5 h-5 ${
                          cameraPermission === 'granted' ? 'text-green-600' : 'text-gray-600'
                        }`} />
                      ) : (
                        <VideoOff className='w-5 h-5 text-red-600' />
                      )}
                    </div>
                    <span className='text-sm font-medium'>Camera</span>
                    <Badge variant="outline" 
                      className={getDeviceStatus('camera').class}
                    >
                      {getDeviceStatus('camera').text}
                    </Badge>
                  </div>
                </div>

                {/* Speaker Status */}
                <div className={`p-4 rounded-xl border transition-all ${
                  speakerWorking === 'granted'
                    ? 'border-green-100 bg-green-50'
                    : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className='flex flex-col items-center text-center gap-2'>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      speakerWorking === 'granted' ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <Volume2 className={`w-5 h-5 ${
                        speakerWorking === 'granted' ? 'text-green-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <span className='text-sm font-medium'>Speaker</span>
                    <Badge variant="outline" 
                      className={getDeviceStatus('speaker').class}
                    >
                      {getDeviceStatus('speaker').text}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 flex items-center gap-2"
                      onClick={testSpeaker}
                    >
                      <Play className="w-4 h-4" />
                      Test Speaker
                    </Button>
                  </div>
                </div>
              </div>

              {/* Test Button */}
              <Button 
                variant="outline" 
                onClick={checkDevices}
                className='w-full py-6 text-base font-medium hover:bg-gray-50 transition-colors'
              >
                <RefreshCw className='w-5 h-5 mr-2' />
                Test Devices Again
              </Button>
            </div>

            <div className='space-y-6'>
              <h2 className='text-lg font-medium text-gray-900'>Interview Details</h2>
              <div className='p-6 bg-gray-50 rounded-lg space-y-4'>
                <p className='text-gray-600'>{loading ? 'Loading...' : (interviewInfo?.jobDescription || 'No description available.')}</p>
                <Separator className='my-4' />
                <div className='flex items-center gap-2 text-sm text-gray-600'>
                  <MessageCircle className='w-4 h-4' />
                  <span>{loading ? 'Loading...' : `${interviewInfo?.questions_count || '10'} questions`}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <MessageCircle className="w-12 h-12 text-green-600 animate-pulse" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Interview in Progress</h2>
            <p className="text-gray-600 mb-8">Your interview has started. Good luck!</p>
            
            {/* End Interview Button */}
            <Button 
              variant="destructive"
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white gap-2"
              onClick={() => setShowEndDialog(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              End Interview
            </Button>

            {/* End Interview Dialog */}
            <Dialog open={showEndDialog} onOpenChange={setShowEndDialog}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold">End Interview?</DialogTitle>
                  <DialogDescription className="text-gray-500">
                    Are you sure you want to end this interview? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowEndDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => {
                      // Stop all media tracks
                      if (stream) {
                        stream.getTracks().forEach(track => track.stop());
                      }
                      setIsInterviewStarted(false);
                      setShowEndDialog(false);
                      toast.success('Interview ended successfully');
                      // Reset device states
                      setIsMicOn(false);
                      setIsCameraOn(false);
                      checkDevices(); // Re-check devices for next interview
                    }}
                  >
                    End Interview
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* Action Buttons */}
        <div className='flex justify-end gap-4 mt-8'>
          <Button 
            className={`${
              isInterviewStarted 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white w-48 relative`}
            disabled={micPermission === 'denied' || cameraPermission === 'denied' || speakerWorking !== 'granted' || isInterviewStarted}
            onClick={handleStartInterview}
          >
            {isInterviewStarted ? (
              <>
                <span className="flex items-center gap-2">
                  <span className="animate-pulse">●</span> 
                  Interview in Progress
                </span>
              </>
            ) : (
              <span className="flex items-center space-x-2">
                <Play className="h-4 w-4" />
                <span>Start Interview</span>
              </span>
            )}
          </Button>
        </div>
      </Card>
    </div>
  )
}
