import { useState, useEffect, useRef } from 'react';
import { SpeechRecognition, SpeechRecognitionErrorEvent, SpeechRecognitionEvent } from './type';


// useSpeech 훅은 음성 인식을 관리하는 커스텀 훅입니다.
const useSpeech = (options: { lang?: string; continuous?: boolean; interimResults?: boolean } = { lang: 'en-US', continuous: true, interimResults: false}) => {
  const { lang = 'en-US', continuous = true, interimResults = false } = options;
  const [isListening, setIsListening] = useState(false); // 현재 듣고 있는지 여부를 저장
  const transcript = useRef(''); // 인식된 텍스트를 저장
  const [error, setError] = useState<string | null>(null); // 오류 메시지를 저장
  const recognitionRef = useRef<SpeechRecognition | null>(null); // SpeechRecognition 객체를 저장
  const [renderCount, setRenderCount] = useState(0); // 렌더링 횟수를 저장

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setError('이 브라우저에서는 Speech Recognition API가 지원되지 않습니다.'); 
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('이 브라우저에서는 Speech Recognition API가 지원되지 않습니다.'); 
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = lang;
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;

    recognition.onstart = () => setIsListening(true); // 인식 시작 시 호출
    recognition.onend = () => setIsListening(false); // 인식 종료 시 호출
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const newTranscript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join('');
      transcript.current =  newTranscript; // 인식된 텍스트를 업데이트
      setRenderCount((prev) => prev + 1); // 렌더링 횟수 증가
    };
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setError(event.error); // 오류 발생 시 오류 메시지 저장
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    // 컴포넌트 언마운트 시 인식 중지
    return () => {
      recognition.stop();
    };
  }, [lang, continuous, interimResults, transcript]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      transcript.current = ''; // 이전 텍스트 초기화
      if(renderCount) setRenderCount(0); // 렌더링 횟수 초기화
      setError(null);
      recognitionRef.current.start(); // 인식 시작
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop(); // 인식 중지
    }
  };

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
  };
};

export default useSpeech;