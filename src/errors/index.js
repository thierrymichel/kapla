import all from './exclamations.json';

const exclamations = {
  all,
  random: () => all[Math.floor(Math.random() * all.length)],
};

export default exclamations;
