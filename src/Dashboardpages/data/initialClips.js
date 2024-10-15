import wordTimings from './wordTimings.js';

const initialClips = [
  {
    id: 1,
    src: 'image1.jpg',
    duration: 5, // Duration in seconds
    startTime: 0, // Starts at 0 seconds
    words: wordTimings
      .filter(wt => wt.start >= 0 && wt.start < 5)
      .map(wt => wt.word),
  },
  {
    id: 2,
    src: 'image2.jpg',
    duration: 5,
    startTime: 5, // Starts immediately after clip 1
    words: wordTimings
      .filter(wt => wt.start >= 5 && wt.start < 10)
      .map(wt => wt.word),
  },
  {
    id: 3,
    src: 'image3.jpg',
    duration: 5,
    startTime: 10, // Starts immediately after clip 2
    words: wordTimings
      .filter(wt => wt.start >= 10 && wt.start < 15)
      .map(wt => wt.word),
  },
  {
    id: 4,
    src: 'image4.jpg',
    duration: 5,
    startTime: 15, // Starts immediately after clip 3
    words: wordTimings
      .filter(wt => wt.start >= 15 && wt.start < 20)
      .map(wt => wt.word),
  },
  {
    id: 5,
    src: 'image5.jpg',
    duration: 5,
    startTime: 20, // Starts immediately after clip 4
    words: wordTimings
      .filter(wt => wt.start >= 20 && wt.start < 25)
      .map(wt => wt.word),
  },
  {
    id: 6,
    src: 'image6.jpg',
    duration: 5,
    startTime: 25, // Starts immediately after clip 5
    words: wordTimings
      .filter(wt => wt.start >= 25 && wt.start < 30)
      .map(wt => wt.word),
  },
  {
    id: 7,
    src: 'image7.jpg',
    duration: 5,
    startTime: 30, // Starts immediately after clip 6
    words: wordTimings
      .filter(wt => wt.start >= 30 && wt.start < 35)
      .map(wt => wt.word),
  },
  {
    id: 8,
    src: 'image8.jpg',
    duration: 5,
    startTime: 35, // Starts immediately after clip 7
    words: wordTimings
      .filter(wt => wt.start >= 35 && wt.start < 40)
      .map(wt => wt.word),
  },
  {
    id: 9,
    src: 'image9.jpg',
    duration: 5,
    startTime: 40, // Starts immediately after clip 8
    words: wordTimings
      .filter(wt => wt.start >= 40 && wt.start < 45)
      .map(wt => wt.word),
  },
  {
    id: 10,
    src: 'image10.jpg',
    duration: 5,
    startTime: 45, // Starts immediately after clip 9
    words: wordTimings
      .filter(wt => wt.start >= 45 && wt.start < 50)
      .map(wt => wt.word),
  },
];

export default initialClips;