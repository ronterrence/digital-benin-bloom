import { useEffect, useRef, useState } from "react";

type TranscriptSegment = {
  start: number;
  end: number;
  speaker?: string;
  text: string;
};

type AudioNarrativeBlockProps = {
  id: string;
  title: string;
  description: string;
  audioSrc: string;
  transcript?: TranscriptSegment[];
};

export default function AudioNarrativeBlock({
  id,
  title,
  description,
  audioSrc,
  transcript,
}: AudioNarrativeBlockProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [showTranscript, setShowTranscript] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const formatTime = (time: number) => {
    if (!time || Number.isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;

    const current = audioRef.current.currentTime;
    const total = audioRef.current.duration || 1;

    setCurrentTime(current);
    setDuration(total);
    setProgress((current / total) * 100);
  };

  const handleSeekToSegment = (start: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = start;
    audioRef.current.play();
  };

  useEffect(() => {
    if (!showTranscript) return;

    const activeIndex = transcript?.findIndex(
      (segment) => currentTime >= segment.start && currentTime <= segment.end
    );

    if (activeIndex === undefined || activeIndex < 0) return;

    const el = document.getElementById(`${id}-line-${activeIndex}`);
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [currentTime, id, showTranscript, transcript]);

  return (
    <section className="mb-28 animate-fade-in">
      <div className="mb-8">
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Narrative
        </p>

        <h2 className="mb-3 text-2xl font-semibold text-gold md:text-3xl">
          {title}
        </h2>

        <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="mb-4">
        <audio
          ref={audioRef}
          controls
          className="w-full"
          onTimeUpdate={handleTimeUpdate}
        >
          <source src={audioSrc} type="audio/mp4" />
          Your browser does not support the audio element.
        </audio>
      </div>

      <div className="mb-2 h-1 w-full rounded bg-border/50">
        <div
          className="h-1 rounded bg-gold transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mb-6 flex justify-between text-xs text-muted-foreground">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {transcript && transcript.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setShowTranscript(!showTranscript)}
            className="text-sm text-gold transition hover:underline"
          >
            {showTranscript ? "Hide transcript" : "Read transcript"}
          </button>

          {showTranscript && (
            <div className="mt-4 max-w-3xl space-y-3">
              {transcript.map((segment, index) => {
                const isActive =
                  currentTime >= segment.start && currentTime <= segment.end;

                return (
                  <button
                    key={`${segment.start}-${index}`}
                    id={`${id}-line-${index}`}
                    type="button"
                    onClick={() => handleSeekToSegment(segment.start)}
                    className={`block w-full rounded-lg px-3 py-3 text-left transition ${
                      isActive
                        ? "border border-gold/30 bg-muted text-foreground"
                        : "border border-transparent text-muted-foreground hover:bg-muted/50"
                    }`}
                  >
                    {segment.speaker && (
                      <p className="mb-1 text-xs uppercase tracking-[0.15em] text-gold">
                        {segment.speaker}
                      </p>
                    )}
                    <p className="text-sm leading-7">{segment.text}</p>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
}