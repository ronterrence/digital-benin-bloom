import { ScanLine, Sparkles, Palette } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const stages = [
  {
    icon: ScanLine,
    title: 'Original Scan',
    description: 'High-resolution digitization of Pitt Rivers\' 1900 photographic plates, preserving every detail of the original publication.',
  },
  {
    icon: Sparkles,
    title: 'AI Enhancement',
    description: 'Machine learning models restore clarity, remove noise and aging artifacts, and sharpen fine details in each figure.',
  },
  {
    icon: Palette,
    title: 'Bronze Reconstruction',
    description: 'AI-assisted colorization recreates the original bronze patina, bringing these historic artworks back to vivid life.',
  },
];

export function MethodologySection() {
  return (
    <section id="methodology" className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-3 text-center text-3xl font-semibold text-primary">
          Reconstruction Pipeline
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
          Each artifact undergoes a three-stage AI-assisted process to reveal details invisible in the original prints.
        </p>
        <div className="grid gap-6 md:grid-cols-3">
          {stages.map((stage, i) => (
            <Card key={i} className="border-border/50 bg-card/50 backdrop-blur">
              <CardContent className="flex flex-col items-center p-8 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <stage.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{stage.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{stage.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
