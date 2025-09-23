import React, { useState, useRef, useEffect } from 'react';

interface VideoMessageProps {
  onVideoRecorded: (videoBlob: Blob, videoUrl: string) => void;
  existingVideoUrl?: string;
}

export const VideoMessage: React.FC<VideoMessageProps> = ({ 
  onVideoRecorded, 
  existingVideoUrl 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string>(existingVideoUrl || '');
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasPermission, setHasPermission] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const recordedVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      // Cleanup
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 }, 
        audio: true 
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setHasPermission(true);
    } catch (error) {
      console.error('Camera permission denied:', error);
      alert('Camera access is required to record video messages. Please allow camera access and try again.');
    }
  };

  const startRecording = () => {
    if (!streamRef.current) return;

    const recorder = new MediaRecorder(streamRef.current, {
      mimeType: 'video/webm;codecs=vp9'
    });

    const chunks: Blob[] = [];

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    recorder.onstop = () => {
      const videoBlob = new Blob(chunks, { type: 'video/webm' });
      const videoUrl = URL.createObjectURL(videoBlob);
      setRecordedVideoUrl(videoUrl);
      onVideoRecorded(videoBlob, videoUrl);
    };

    recorder.start();
    setMediaRecorder(recorder);
    setIsRecording(true);
    setRecordingTime(0);

    // Start timer
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => {
        if (prev >= 30) { // Max 30 seconds
          stopRecording();
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
    }
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Stop camera stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setHasPermission(false);
  };

  const deleteVideo = () => {
    setRecordedVideoUrl('');
    onVideoRecorded(new Blob(), '');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium mb-2">🎥 Video Message (Optional)</label>
      
      {!hasPermission && !recordedVideoUrl && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <div className="text-4xl mb-4">🎥</div>
          <h3 className="text-lg font-medium mb-2">Add a Personal Video Message</h3>
          <p className="text-gray-600 mb-4">
            Record a short video message to make your gift extra special!
          </p>
          <button
            type="button"
            onClick={requestCameraPermission}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 font-medium"
          >
            📹 Start Recording
          </button>
        </div>
      )}

      {hasPermission && !recordedVideoUrl && (
        <div className="space-y-4">
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              muted
              className="w-full h-64 object-cover"
            />
            
            {isRecording && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">REC {formatTime(recordingTime)}</span>
              </div>
            )}

            <div className="absolute top-4 right-4 text-white text-sm bg-black/50 px-2 py-1 rounded">
              Max: 30s
            </div>
          </div>

          <div className="flex justify-center gap-4">
            {!isRecording ? (
              <button
                type="button"
                onClick={startRecording}
                className="bg-red-500 text-white px-8 py-3 rounded-full hover:bg-red-600 font-medium flex items-center gap-2"
              >
                <div className="w-4 h-4 bg-white rounded-full"></div>
                Start Recording
              </button>
            ) : (
              <button
                type="button"
                onClick={stopRecording}
                className="bg-gray-800 text-white px-8 py-3 rounded-full hover:bg-gray-900 font-medium flex items-center gap-2"
              >
                <div className="w-4 h-4 bg-white"></div>
                Stop Recording
              </button>
            )}
            
            <button
              type="button"
              onClick={() => {
                if (streamRef.current) {
                  streamRef.current.getTracks().forEach(track => track.stop());
                }
                setHasPermission(false);
              }}
              className="bg-gray-500 text-white px-6 py-3 rounded-full hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {recordedVideoUrl && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-green-600">✅</span>
              <span className="font-medium text-green-800">Video Message Recorded!</span>
            </div>
            
            <video
              ref={recordedVideoRef}
              src={recordedVideoUrl}
              controls
              className="w-full h-64 bg-black rounded-lg"
            />
            
            <div className="flex justify-between items-center mt-3">
              <span className="text-sm text-green-700">
                Your personal video message is ready to be included with the gift!
              </span>
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setHasPermission(false);
                    requestCameraPermission();
                  }}
                  className="text-sm bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  🔄 Re-record
                </button>
                
                <button
                  type="button"
                  onClick={deleteVideo}
                  className="text-sm bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>💡 Tips:</strong> Keep it short and sweet! Video messages make gifts more personal and memorable. 
          Recipients love seeing the thought behind their gift.
        </p>
      </div>
    </div>
  );
};