import { Multimap } from '../multimap';

const events = {
  enter: ['mouseenter', 'touchstart'],
  leave: ['mouseleave', 'touchend'],
  move: ['mousemove', 'touchmove'],
  over: ['mouseover', 'touchmove'],
  out: ['mouseout', 'touchmove'],
};

export const mixedEvents = new Multimap();

Object.keys(events).forEach(type => {
  events[type].forEach(subType => {
    mixedEvents.add(type, subType);
  });
});
