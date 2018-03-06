import { Multimap } from '../multimap';

const events = {
  enter: ['mouseenter', 'touchstart'],
  move: ['mousemove', 'touchmove'],
  leave: ['mouseleave', 'touchend'],
};

const mixedEvents = new Multimap();

Object.keys(events).forEach(key => {
  events[key].forEach(event => {
    mixedEvents.add(key, event);
  });
});

export default mixedEvents;
