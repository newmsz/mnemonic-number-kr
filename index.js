const fs = require('fs');
const path = require('path');
const debug = require('debug')('mnkr:main');
const shuffleSeed = require('shuffle-seed');
const seedrandom = require('seedrandom');
const EventEmitter = require('events');
const async = require('async');

class MnemonicNumberKr extends EventEmitter {
  constructor (options = { }) {
    super();

    this._dictionaries = null;
    this._shuffleSeed = options.shuffle || null;
    this.load(options.dictionaries || [ path.join(__dirname, 'words.txt') ]);
  }

  load (filenames) {
    async.map(filenames, (filename, cb) => {
      fs.readFile(filename, (err, buf) => {
        if(err) throw err;

        let split = buf.toString().trim().split('\n').map(w => w.trim());
        let dedup = { };
        split = split.filter(w => {
          w = w.trim();
          if(!w) return false;
          if(w.length >= 6) {
            return false;
          }
          if(w.split(' ').length != 1) {
            debug(`A word having a space: ${w}`);
            return false;
          }
          if(dedup[w]) {
            debug(`Duplicated word: ${w}`);
            return false;
          }
          dedup[w] = true;
          return true;
        });

        if(this._shuffleSeed) {
          split = shuffleSeed.shuffle(split, this._shuffleSeed);
        }

        fs.writeFileSync('../test/res.txt', split.join('\n'));
        return cb(null, split);
      });
    }, (err, dictionaries) => {
      this._dictionaries = dictionaries;
      this.emit('load');
    });

  }

  get combinations () {
    if(!this._dictionaries) return 0;
    let comb = 1;
    for(let i=0; i<this._dictionaries.length; i++) {
      comb *= this._dictionaries[i].length;
    }
    return comb;
  }

  random () {
    let rand = Math.floor(Math.random()*this.combinations);
    return this.fromInteger(rand);
  }

  fromInteger (integer) {
    if(!this._dictionaries) return '';
    if(integer < 0) throw new Error('Negative integers are not supported');

    let rem = integer;
    let res = [];
    let prev = 0;

    for(let i=0; i<this._dictionaries.length; i++) {
      let len = this._dictionaries[i].length;
      let cur = rem % len;
      let val = (cur + prev*2) % len
      res.push(this._dictionaries[i][val]);
      rem -= cur;
      rem /= len;
      prev = cur;
    }

    return res;
  }

  toInteger (words) {
    if(!this._dictionaries) return -1;

    let num = 0;
    let mul = 1;
    let prev = 0;

    for(let i=0; i<this._dictionaries.length; i++) {
      let len = this._dictionaries[i].length;
      let cur = this._dictionaries[i].indexOf(words[i]);
      let val = cur - prev*2;
      while(val < 0) val += len;
      num += val * mul;
      prev = val;
      mul *= len;
    }

    return num;
  }
}

module.exports = MnemonicNumberKr;
