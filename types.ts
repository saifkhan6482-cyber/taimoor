
export enum VoiceName {
  Kore = 'Kore',
  Puck = 'Puck',
  Charon = 'Charon',
  Fenrir = 'Fenrir',
  Zephyr = 'Zephyr'
}

/* Added Calm and Whispered to Emotion type and removed duplicated entries */
export type Emotion = 
  | 'Neutral' 
  | 'Professional' 
  | 'Authoritative' 
  | 'Serious' 
  | 'Dramatic' 
  | 'Mysterious' 
  | 'Cheerful' 
  | 'Excited' 
  | 'Sympathetic' 
  | 'Calm' 
  | 'Whispered' 
  | 'Sarcastic';

export interface GeneratedSpeech {
  id: string;
  text: string;
  voice: string;
  emotion: Emotion;
  emotionIntensity: number;
  speed: number;
  pitch: string;
  timestamp: number;
  audioBlob: Blob;
  audioUrl: string;
  backgroundTrackId?: string;
  backgroundVolume?: number;
}

export interface SpeechConfig {
  voice: string;
  emotion: Emotion;
  emotionIntensity: number;
  speed: number;
  pitch: 'Low' | 'Medium' | 'High';
  backgroundTrackId: string;
  backgroundVolume: number;
}

export interface VoiceCharacter {
  id: string;
  name: string;
  engine: VoiceName;
  desc: string;
  role: string;
  gender: 'Male' | 'Female' | 'Non-binary';
  icon: string;
  color: string;
}

export interface BackgroundTrack {
  id: string;
  name: string;
  url: string;
  icon: string;
  category: string;
}

export const BACKGROUND_TRACKS: BackgroundTrack[] = [
  { id: 'none', name: 'No Background', url: '', icon: 'fa-volume-mute', category: 'None' },
  { id: 'lofi', name: 'Midnight Lofi', url: 'https://actions.google.com/sounds/v1/science_fiction/ambient_loop.ogg', icon: 'fa-mug-hot', category: 'Relaxing' },
  { id: 'corp', name: 'Corporate Minimal', url: 'https://actions.google.com/sounds/v1/science_fiction/low_hum_loop.ogg', icon: 'fa-chart-line', category: 'Business' },
  { id: 'zen', name: 'Zen Garden', url: 'https://actions.google.com/sounds/v1/water/crashing_waves.ogg', icon: 'fa-leaf', category: 'Atmospheric' },
  { id: 'epic', name: 'Dark Cinema', url: 'https://actions.google.com/sounds/v1/horror/creepy_low_hum.ogg', icon: 'fa-dragon', category: 'Cinematic' },
  { id: 'tech', name: 'Cyberpunk Pulse', url: 'https://actions.google.com/sounds/v1/science_fiction/scifi_hum.ogg', icon: 'fa-microchip', category: 'Electronic' },
];

export const CHARACTERS: VoiceCharacter[] = [
  { id: 'Nova', name: 'Nova', engine: VoiceName.Puck, desc: 'Energetic, friendly, and helpful. Perfect for conversational assistants.', role: 'Daily Assistant', gender: 'Non-binary', icon: 'fa-sun', color: 'from-orange-400 to-yellow-600' },
  { id: 'Adam', name: 'Adam', engine: VoiceName.Charon, desc: 'Deep, wise, and mature storyteller with a gravelly charm.', role: 'Elderly Narrator', gender: 'Male', icon: 'fa-person-cane', color: 'from-amber-600 to-orange-900' },
  { id: 'Marcus', name: 'Marcus', engine: VoiceName.Fenrir, desc: 'Cool, urban, and rhythmic. Perfect for modern branding.', role: 'Streetwise Creative', gender: 'Male', icon: 'fa-bolt-lightning', color: 'from-purple-600 to-fuchsia-800' },
  { id: 'Ursa', name: 'Ursa', engine: VoiceName.Zephyr, desc: 'Calm, steady, and deeply reassuring with a professional touch.', role: 'Reliable Guide', gender: 'Female', icon: 'fa-mountain', color: 'from-emerald-600 to-teal-800' },
  { id: 'Vega', name: 'Vega', engine: VoiceName.Puck, desc: 'Bright, optimistic, and clear. Ideal for education and kids.', role: 'Creative Partner', gender: 'Female', icon: 'fa-star', color: 'from-blue-400 to-indigo-600' },
  { id: 'Lyra', name: 'Lyra', engine: VoiceName.Zephyr, desc: 'Expressive, warm, and filled with human-like curiosity.', role: 'Inquisitive Mind', gender: 'Female', icon: 'fa-feather', color: 'from-pink-500 to-rose-700' },
  { id: 'Orion', name: 'Orion', engine: VoiceName.Charon, desc: 'Deep, resonant, and mature. Great for storytelling and wisdom.', role: 'The Storyteller', gender: 'Male', icon: 'fa-book', color: 'from-slate-700 to-slate-950' },
  { id: 'Eclipse', name: 'Eclipse', engine: VoiceName.Fenrir, desc: 'Edgy, rhythmic, and modern. Perfect for urban branding.', role: 'Streetwise Creative', gender: 'Non-binary', icon: 'fa-moon', color: 'from-indigo-700 to-purple-900' },
  { id: 'Capella', name: 'Capella', engine: VoiceName.Puck, desc: 'Bubbly, high-energy, and youthful for social media.', role: 'Digital Influencer', gender: 'Female', icon: 'fa-hashtag', color: 'from-fuchsia-500 to-pink-600' },
  { id: 'Pegasus', name: 'Pegasus', engine: VoiceName.Fenrir, desc: 'Direct, clear, and slightly raspy with natural grit.', role: 'Podcast Host', gender: 'Male', icon: 'fa-wind', color: 'from-cyan-600 to-blue-800' },
  { id: 'Arcturus', name: 'Arcturus', engine: VoiceName.Kore, desc: 'Authoritative, precise, and highly articulate for business.', role: 'CEO / Academic', gender: 'Male', icon: 'fa-graduation-cap', color: 'from-amber-700 to-stone-900' },
  { id: 'Polaris', name: 'Polaris', engine: VoiceName.Zephyr, desc: 'Smooth, polished, and broadcast-ready for news.', role: 'Voice of Reason', gender: 'Non-binary', icon: 'fa-compass', color: 'from-blue-700 to-slate-900' },
];
