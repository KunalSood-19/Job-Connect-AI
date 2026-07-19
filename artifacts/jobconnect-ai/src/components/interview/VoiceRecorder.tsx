import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

interface Props {
  value: string;
  onChange: (text: string) => void;
}

export default function VoiceRecorder({
  value,
  onChange,
}: Props) {

  const recognitionRef = useRef<any>(null);

  const [listening, setListening] = useState(false);

  useEffect(() => {

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.continuous = true;

    recognition.interimResults = true;

    recognition.onresult = (event: any) => {

      let transcript = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {

        transcript += event.results[i][0].transcript;

      }

      onChange(transcript);

    };

    recognition.onend = () => {

      setListening(false);

    };

    recognitionRef.current = recognition;

  }, [onChange]);

  function startRecording() {

    if (!recognitionRef.current) return;

    recognitionRef.current.start();

    setListening(true);

  }

  function stopRecording() {

    recognitionRef.current?.stop();

    setListening(false);

  }

  return (

    <Button
      type="button"
      variant={listening ? "destructive" : "secondary"}
      onClick={
        listening
          ? stopRecording
          : startRecording
      }
    >

      {listening ? (

        <MicOff className="mr-2 h-5 w-5"/>

      ) : (

        <Mic className="mr-2 h-5 w-5"/>

      )}

      {listening

        ? "Stop Recording"

        : "Start Speaking"}

    </Button>

  );

}