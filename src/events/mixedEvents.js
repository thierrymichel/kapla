import { Multimap } from '../multimap';

const events = {
  enter: ['mouseenter', 'touchstart'],
  move: ['mousemove', 'touchmove'],
  leave: ['mouseleave', 'touchend'],
};

export const mixedEvents = new Multimap();

Object.keys(events).forEach(type => {
  events[type].forEach(subType => {
    mixedEvents.add(type, subType);
  });
});
