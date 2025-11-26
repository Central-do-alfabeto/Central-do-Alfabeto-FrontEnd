// audioUtils.ts
const TARGET_SAMPLE_RATE = 16000;

export async function convertWebMToWAV(webmBlob: Blob): Promise<Blob> {
  const audioContext = new AudioContext();
  const arrayBuffer = await webmBlob.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  await audioContext.close();

  const mono = mixToMono(audioBuffer);
  const resampled = resample(mono, audioBuffer.sampleRate, TARGET_SAMPLE_RATE);
  const wavBuffer = encodeWav(resampled, TARGET_SAMPLE_RATE);

  return new Blob([wavBuffer], { type: "audio/wav" });
}

function mixToMono(buffer: AudioBuffer): Float32Array {
  if (buffer.numberOfChannels === 1) {
    return buffer.getChannelData(0).slice();
  }

  const { numberOfChannels, length } = buffer;
  const mono = new Float32Array(length);

  for (let channel = 0; channel < numberOfChannels; channel++) {
    const data = buffer.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      mono[i] += data[i] / numberOfChannels;
    }
  }

  return mono;
}

function resample(
  data: Float32Array,
  sourceSampleRate: number,
  targetSampleRate: number
): Float32Array {
  if (sourceSampleRate === targetSampleRate) {
    return data;
  }

  if (sourceSampleRate < targetSampleRate) {
    // Evitar upsampling simples; manter dados originais.
    return data;
  }

  const ratio = sourceSampleRate / targetSampleRate;
  const newLength = Math.round(data.length / ratio);
  const result = new Float32Array(newLength);

  for (let i = 0; i < newLength; i++) {
    const idx = i * ratio;
    const idxFloor = Math.floor(idx);
    const idxCeil = Math.min(idxFloor + 1, data.length - 1);
    const weight = idx - idxFloor;

    result[i] = data[idxFloor] * (1 - weight) + data[idxCeil] * weight;
  }

  return result;
}

function encodeWav(samples: Float32Array, sampleRate: number): ArrayBuffer {
  const bytesPerSample = 2;
  const blockAlign = bytesPerSample; // mono
  const dataSize = samples.length * bytesPerSample;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true); // Subchunk1Size
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true); // byte rate
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true); // bits per sample
  writeString(view, 36, "data");
  view.setUint32(40, dataSize, true);

  let offset = 44;
  for (let i = 0; i < samples.length; i++, offset += 2) {
    const sample = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
  }

  return buffer;
}

function writeString(view: DataView, offset: number, value: string) {
  for (let i = 0; i < value.length; i++) {
    view.setUint8(offset + i, value.charCodeAt(i));
  }
}