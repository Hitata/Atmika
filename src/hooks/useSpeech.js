import { useEffect, useRef, useState } from 'react';

export default function useSpeech({ lang = 'vi-VN', continuous = false } = {}) {
  const [listening, setListening]   = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError]           = useState(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Trình duyệt không hỗ trợ Web Speech API');
      return;
    }

    const recog = new SpeechRecognition();
    recog.lang = lang;
    recog.continuous = continuous;
    recog.interimResults = false;
    recog.maxAlternatives = 1;

    recog.onresult = (e) =>
      setTranscript(e.results[0][0].transcript.trim());

    recog.onerror  = (e) => {
      setError(e.error);
      setListening(false);
    };

    recog.onstart  = () => setListening(true);
    recog.onend    = () => setListening(false);

    recognitionRef.current = recog;
  }, [lang, continuous]);

  const start = () => {
    setTranscript('');
    recognitionRef.current?.start();
  };

  const stop = () => recognitionRef.current?.stop();
  const resetTranscript = () => setTranscript('');

  return {
    transcript,
    listening,
    error,
    start,
    stop,
    resetTranscript,
  };
}
