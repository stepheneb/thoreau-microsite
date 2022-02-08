export const createSilentAudioClip = (container) => {
  const silentSrc = './media/audio/silence-0.01s.mp3';
  let silentAudioElement = document.createElement('audio');
  silentAudioElement.id = 'audio';
  silentAudioElement.src = silentSrc;
  silentAudioElement.type = 'audio/mpeg';
  container.appendChild(silentAudioElement);
  return silentAudioElement;
};
