import { useEffect, useState } from 'react'

export default function useListen() {
    const [text, setText] = useState('')
    const [isSpeaking, setIsSpeaking] = useState(false);


    // 음성 합성 시작
    const responseSpeak = () => {
      // if (window.speechSynthesis.speaking) {
      //   window.speechSynthesis.cancel();
      // }
      const utterance = new SpeechSynthesisUtterance(text);
  
      utterance.onend = () => {
        setIsSpeaking(false);
      };
  
      // utterance.onerror = () => {
      //   customToast({ message: '음성 지원 중 오류가 발생했습니다.', status: 200 })
      // };
  
      window.speechSynthesis.speak(utterance);
    };
  
    // 음성 합성 종료
    const stopSpeech = () => {
      window.speechSynthesis.cancel();
    };
  
    // 음성 합성 시작/종료
    const handleSpeaker = () => {
      window.speechSynthesis.cancel();
      if(isSpeaking) {
        stopSpeech()
      } else {
        responseSpeak()
      }
      setIsSpeaking(!isSpeaking)
    };
  
    useEffect(() => {
      return () => {
        window.speechSynthesis.cancel();
      }
    },[])
    return {
        responseSpeak,
        stopSpeech,
        handleSpeaker,
        isSpeaking,
        text,
        setText
    }
}