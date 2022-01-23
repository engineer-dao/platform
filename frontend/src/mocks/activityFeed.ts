import { IActivityFeedItem } from 'interfaces/IActivityFeedItem';

export const activity: IActivityFeedItem[] = [
  {
    id: '1',
    type: 'comment',
    person: { name: '0xa5409ec958C83C3f309868babACA7c86DCB077c1', href: '#' },
    imageUrl: 'https://avatars.dicebear.com/api/micah/random.svg',
    comment:
      "Hey there! Excited to take on this challenge. I'm a frontend developer with 10+ years of experience, React is my tool of choice for reactive UI work. I'll get started right away. For the button animations, do you have a preference for timing and easing?",
    date: '6d ago',
  },
  {
    id: '2',
    type: 'status',
    status: 'active',
    person: { name: '0xa5409ec958C83C3f309868babACA7c86DCB077c1', href: '#' },
    date: '2d ago',
  },
  {
    id: '3',
    type: 'comment',
    person: { name: 'reisr.eth', href: '#' },
    imageUrl: 'https://avatars.dicebear.com/api/micah/reis.svg',
    comment:
      "Hello fellow cryptonaut! Excited to check out EngineerDAO. Our core team is running hot right now and we need some help building out this UI. I've included our repo and instructions. Please drop me a note if you have any questions. We're also happy to jump on a Zoom call.",
    date: '2h ago',
  },
  {
    id: '4',
    type: 'status',
    status: 'available',
    person: { name: 'reisr.eth', href: '#' },
    date: '1d ago',
  },
];
