import type { CardData, TemplateKey } from './types';

export const templateMeta: Record<
  TemplateKey,
  { name: string; emoji: string; description: string }
> = {
  friendship: {
    name: 'Friendship Day',
    emoji: '🤝',
    description: 'Celebrate your bond with inside jokes and sweet memories.',
  },
  proposal: {
    name: 'Proposal',
    emoji: '💍',
    description: 'Pop the question in the most unforgettable way.',
  },
  valentine: {
    name: "Valentine's",
    emoji: '💘',
    description: 'A romantic interactive journey for your special someone.',
  },
  apology: {
    name: 'Apology',
    emoji: '🙏',
    description: 'Say sorry with sincerity, humor, and a heartfelt note.',
  },
  birthday: {
    name: 'Birthday',
    emoji: '🎂',
    description: 'Make their birthday an interactive adventure.',
  },
};

export const templateKeys = Object.keys(templateMeta) as TemplateKey[];

export function makeDefaultCard(template: TemplateKey = 'friendship'): CardData {
  const base: CardData = {
    template,
    theme: 'buttercup',
    recipientName: 'Friend',
    authorName: 'Me',
    introNote: 'I made a tiny place on the internet for you.',
    museumTitle: 'Museum of Us',
    exhibits: {
      scratch: {
        title: 'Exhibit 001 — Dusty Glass',
        hiddenText: 'You matter more than you know.',
        coverText: 'Rub the dusty glass to reveal the secret...',
      },
      slideLock: {
        title: 'Exhibit 002 — Locked Drawer',
        label: 'Slide to unlock',
        hiddenText: 'Best memory: that random Tuesday we laughed till we cried.',
      },
      curtain: {
        title: 'Exhibit 003 — Behind the Curtain',
        hiddenText: 'This is us. Always ridiculous. Always perfect.',
        imageUrl: '',
      },
    },
    diagnostic: {
      title: 'Friendship Diagnostic',
      checks: [
        { label: 'Checking loyalty...', result: 'SUSPICIOUS' },
        { label: 'Checking emotional damage...', result: 'MUTUAL' },
        { label: 'Checking meme frequency...', result: 'EXCESSIVE' },
        { label: 'Checking bond strength...', result: 'UNBREAKABLE' },
      ],
      stampText: 'NO CANCELLATIONS. NO REFUNDS.',
    },
    letter: `Hey,

I know this is a lot for a random day, but I wanted to make you something that wasn't just a text or a card from a store.

You make ordinary days feel like something worth remembering. Thank you for the laughs, the rants, the silence that was never awkward, and for showing up even when I didn't ask.

I'm really glad you exist.

—`,
    letterSignature: 'Me',
    wordSearch: {
      title: 'Find the words that describe us',
      words: [
        { word: 'LOVE', emoji: '❤️' },
        { word: 'TRUST', emoji: '🤝' },
        { word: 'LAUGH', emoji: '😂' },
        { word: 'LOYAL', emoji: '🛡️' },
      ],
    },
    agreement: {
      title: 'The Official Agreement',
      items: [
        { id: 'i1', text: 'Continue sending unnecessary memes at odd hours' },
        { id: 'i2', text: 'Provide emotional support during minor inconveniences' },
        { id: 'i3', text: 'Never go to bed mad (unless very tired)' },
        { id: 'i4', text: 'Agree that this bond is permanent and non-refundable' },
      ],
      stampText: 'ACCEPTED & RENEWED',
    },
    outro: {
      message: 'Thanks for playing along. Now go text me.',
      whatsappNumber: '',
      email: '',
    },
  };

  if (template === 'proposal') {
    base.theme = 'blossom';
    base.museumTitle = 'Museum of Us';
    base.exhibits.scratch.hiddenText = 'Every moment led to this.';
    base.exhibits.slideLock.hiddenText = 'My favorite chapter is the one with you in it.';
    base.exhibits.curtain.hiddenText = 'You. Always you.';
    base.diagnostic.title = 'Love Diagnostic';
    base.diagnostic.checks = [
      { label: 'Checking heart rate...', result: 'RACING' },
      { label: 'Checking certainty...', result: 'ABSOLUTE' },
      { label: 'Checking forever...', result: 'CONFIRMED' },
    ];
    base.diagnostic.stampText = 'NO TURNING BACK. NO REGRETS.';
    base.letter = `My whole life,

I kept looking for the right person, not realizing I was looking for the feeling you give me every single day.

You are my favorite hello and my hardest goodbye. I don't just love you — I choose you, today and every day after.

Will you stay forever?`,
    base.letterSignature = 'Yours';
    base.wordSearch.words = [
      { word: 'LOVE', emoji: '❤️' },
      { word: 'FOREVER', emoji: '∞' },
      { word: 'YES', emoji: '💍' },
      { word: 'HOME', emoji: '🏡' },
    ];
    base.agreement.title = 'The Forever Agreement';
    base.agreement.items = [
      { id: 'i1', text: 'Love each other on good days and bad hair days' },
      { id: 'i2', text: 'Choose each other, every single day' },
      { id: 'i3', text: 'Never stop holding hands' },
      { id: 'i4', text: 'Say YES to forever' },
    ];
    base.agreement.stampText = 'FOREVER ACCEPTED';
    base.outro.message = 'Now come here and say yes.';
  } else if (template === 'valentine') {
    base.theme = 'blossom';
    base.introNote = "I built a little world just for you, Valentine.";
    base.exhibits.scratch.hiddenText = 'You are my favorite person.';
    base.exhibits.slideLock.hiddenText = "Valentine, you make my heart do weird things.";
    base.exhibits.curtain.hiddenText = 'Cupid called. He said we are his best work.';
    base.diagnostic.title = 'Romance Diagnostic';
    base.diagnostic.checks = [
      { label: 'Checking butterflies...', result: 'INTENSE' },
      { label: 'Checking chemistry...', result: 'EXPLOSIVE' },
      { label: 'Checking heart eyes...', result: 'PERMANENT' },
    ];
    base.diagnostic.stampText = 'SIGNED, SEALED, DELIVERED.';
    base.letter = `My Valentine,

Roses are red, violets are blue, this rhyme is cliché, but my love is true.

You are the plot twist I never saw coming and the chapter I never want to end. Happy Valentine's Day to my favorite person.`;
    base.letterSignature = 'Your Valentine';
    base.wordSearch.words = [
      { word: 'LOVE', emoji: '❤️' },
      { word: 'KISS', emoji: '💋' },
      { word: 'CUPID', emoji: '🏹' },
      { word: 'HEART', emoji: '💗' },
    ];
    base.agreement.title = 'The Valentine Pact';
    base.agreement.items = [
      { id: 'i1', text: 'Be my Valentine today and every day' },
      { id: 'i2', text: 'Share dessert (but I eat most of it)' },
      { id: 'i3', text: 'Accept cheesy pickup lines gracefully' },
      { id: 'i4', text: 'Agree we are the cutest couple ever' },
    ];
    base.agreement.stampText = 'VALENTINE SEALED';
  } else if (template === 'apology') {
    base.theme = 'sky';
    base.introNote = 'I messed up. Let me make it right.';
    base.exhibits.scratch.hiddenText = "I'm sorry. Really, truly sorry.";
    base.exhibits.slideLock.hiddenText = 'I value you more than my pride.';
    base.exhibits.curtain.hiddenText = 'Please forgive me. I will do better.';
    base.diagnostic.title = 'Apology Diagnostic';
    base.diagnostic.checks = [
      { label: 'Checking remorse...', result: 'GENUINE' },
      { label: 'Checking lesson learned...', result: 'CONFIRMED' },
      { label: 'Checking promise to do better...', result: 'IRONCLAD' },
    ];
    base.diagnostic.stampText = 'APOLOGY CERTIFIED. PLEASE ACCEPT.';
    base.letter = `I know I messed up,

and I know sorry is just a word. But I mean it. I am sorry for what I did, for how it made you feel, and for the space I put between us.

You deserve better than a quick text. You deserve this — me, trying, in the clumsiest most honest way I can.

I will do better. Please let me.`;
    base.letterSignature = 'Truly sorry';
    base.wordSearch.words = [
      { word: 'SORRY', emoji: '🙏' },
      { word: 'PLEASE', emoji: '🥺' },
      { word: 'FORGIVE', emoji: '💝' },
      { word: 'BETTER', emoji: '🌱' },
    ];
    base.agreement.title = 'The Apology Acceptance';
    base.agreement.items = [
      { id: 'i1', text: 'Accept this apology (no grudge holding)' },
      { id: 'i2', text: 'Let me make it up to you' },
      { id: 'i3', text: 'Agree I can be dumb sometimes' },
      { id: 'i4', text: 'Promise to talk it out, not walk it out' },
    ];
    base.agreement.stampText = 'FORGIVEN';
  } else if (template === 'birthday') {
    base.theme = 'buttercup';
    base.introNote = 'I made you a birthday adventure!';
    base.museumTitle = 'Museum of You';
    base.exhibits.scratch.hiddenText = 'You are a gift to everyone who knows you.';
    base.exhibits.slideLock.hiddenText = 'Best birthday wish: more years of you being you.';
    base.exhibits.curtain.hiddenText = 'Today the world celebrates you!';
    base.diagnostic.title = 'Birthday Diagnostic';
    base.diagnostic.checks = [
      { label: 'Checking awesomeness...', result: 'OFF THE CHARTS' },
      { label: 'Checking aging...', result: 'LIKE FINE WINE' },
      { label: 'Checking cake readiness...', result: 'READY' },
    ];
    base.diagnostic.stampText = 'HAPPY BIRTHDAY! NO TAKEBACKS.';
    base.letter = `Happy Birthday!

Another year of you being unapologetically amazing. I hope this year brings you everything you wish for and a few surprises you never saw coming.

You make the world brighter just by being in it. Now blow out the candles and make a big one.`;
    base.letterSignature = 'With love';
    base.wordSearch.words = [
      { word: 'PARTY', emoji: '🎉' },
      { word: 'CAKE', emoji: '🎂' },
      { word: 'WISH', emoji: '🌟' },
      { word: 'FUN', emoji: '🎈' },
    ];
    base.agreement.title = 'The Birthday Contract';
    base.agreement.items = [
      { id: 'i1', text: 'Have the best birthday ever' },
      { id: 'i2', text: 'Eat too much cake (no regrets)' },
      { id: 'i3', text: 'Accept all compliments today' },
      { id: 'i4', text: 'Make a wish and keep it secret' },
    ];
    base.agreement.stampText = 'BIRTHDAY APPROVED';
  }

  return base;
}
