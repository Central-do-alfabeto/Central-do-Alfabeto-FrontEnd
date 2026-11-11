export class FakeSpeechRecognition {
  static instances: FakeSpeechRecognition[] = [];
  lang = "";
  continuous = true;
  interimResults = true;
  maxAlternatives = 1;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null = null;
  onerror: ((event: { error: string }) => void) | null = null;
  onend: (() => void) | null = null;
  started = false;
  aborted = false;

  constructor() {
    FakeSpeechRecognition.instances.push(this);
  }
  start() {
    this.started = true;
  }
  stop() {
    this.onend?.();
  }
  abort() {
    this.aborted = true;
  }
  emitResult(...alternatives: string[]) {
    this.onresult?.({ results: [alternatives.map((transcript) => ({ transcript }))] });
  }
}
