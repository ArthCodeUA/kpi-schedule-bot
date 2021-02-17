exports.random = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
};

exports.coinflip = () => {
  return this.random(0, 1) ? 'Орёл' : 'Решка';
};
