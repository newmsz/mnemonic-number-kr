const assert = require('assert');

describe('Loading dictionaries', () => {
  it('should be loaded', done  => {
    let MnemonicNumberKr = require('.');
    let mnum = new MnemonicNumberKr();

    mnum.on('load', () => {
      assert.ok(mnum.combinations > 0);
      done();
    });
  });

  it('should be loaded with custom dictionary', done  => {
    let MnemonicNumberKr = require('.');
    let mnum = new MnemonicNumberKr({
      dictionaries: [ 'test.txt' ]
    });

    mnum.on('load', () => {
      assert.strictEqual(mnum.combinations, 3);
      done();
    });
  });

  it('should be loaded with more than one dictionary', done  => {
    let MnemonicNumberKr = require('.');
    let mnum = new MnemonicNumberKr({
      dictionaries: [ 'test.txt', 'test.txt' ]
    });

    mnum.on('load', () => {
      assert.strictEqual(mnum.combinations, 9);
      done();
    });
  });
});

describe('Conversion', () => {
  it('should en/decode numbers for all combinations w/ one dictionary', done  => {
    let MnemonicNumberKr = require('.');
    let mnum = new MnemonicNumberKr({
      dictionaries: [ 'test.txt' ]
    });

    mnum.on('load', () => {
      assert.strictEqual(mnum.combinations, 3);
      for(let i=0; i<mnum.combinations; i++) {
        let words = mnum.fromInteger(i);
        assert.strictEqual(words.length, 1);
        assert.strictEqual(mnum.toInteger(words), i);
      }

      done();
    });
  });

  it('should en/decode numbers for all combinations w/ two dictionaries', done  => {
    let MnemonicNumberKr = require('.');
    let mnum = new MnemonicNumberKr({
      dictionaries: [ 'test.txt', 'test.txt' ]
    });

    mnum.on('load', () => {
      assert.strictEqual(mnum.combinations, 9);
      for(let i=0; i<mnum.combinations; i++) {
        let words = mnum.fromInteger(i);
        assert.strictEqual(words.length, 2);
        assert.strictEqual(mnum.toInteger(words), i);
      }

      done();
    });
  });

  it('should en/decode numbers for all combinations w/ three dictionaries', done  => {
    let MnemonicNumberKr = require('.');
    let mnum = new MnemonicNumberKr({
      dictionaries: [ 'test.txt', 'test.txt', 'test.txt' ]
    });

    mnum.on('load', () => {
      assert.strictEqual(mnum.combinations, 27);
      for(let i=0; i<mnum.combinations; i++) {
        let words = mnum.fromInteger(i);
        assert.strictEqual(words.length, 3);
        assert.strictEqual(mnum.toInteger(words), i);
      }

      done();
    });
  });

  it('should show overflowing numbers as like modular operation', done  => {
    let MnemonicNumberKr = require('.');
    let mnum = new MnemonicNumberKr({
      dictionaries: [ 'test.txt', 'test.txt', 'test.txt' ]
    });

    mnum.on('load', () => {
      assert.strictEqual(mnum.combinations, 27);
      for(let i=0; i<mnum.combinations*3; i++) {
        let words = mnum.fromInteger(i);
        assert.strictEqual(words.length, 3);
        assert.strictEqual(mnum.toInteger(words), i%mnum.combinations);
      }

      done();
    });
  });
});

describe('Shuffle check', () => {
  it('should be loaded', done  => {
    let MnemonicNumberKr = require('.');
    let mnum = new MnemonicNumberKr({
      dictionaries: ['animals.txt', 'test.txt']
    });

    mnum.on('load', () => {
      assert.ok(mnum.combinations > 0);
      context.prevShuffled = mnum._dictionaries;
      done();
    });
  });

  it('should be loaded with shuffle seed with different combinations', done  => {
    let MnemonicNumberKr = require('.');
    let mnum = new MnemonicNumberKr({
      shuffle: 'Any shuffle seed',
      dictionaries: ['animals.txt', 'test.txt']
    });

    mnum.on('load', () => {
      assert.ok(mnum.combinations > 0);
      assert.strictEqual(context.prevShuffled.length, mnum._dictionaries.length);

      for(let i=0; i<context.prevShuffled.length; i++) {
        assert.strictEqual(context.prevShuffled[i].length, mnum._dictionaries[i].length);

        for(let j=0; j<context.prevShuffled[i].length; j++) {
          if(context.prevShuffled[i][j] != mnum._dictionaries[i][j]) {
            if(i+1 == context.prevShuffled.length) {
              context.prevShuffled = mnum._dictionaries;
              return done();
            } else {
              break;
            }
          }
        }
      }

      assert.fail('should not reach');
    });
  });

  it('should show exact combinations with the same shuffle seed', done  => {
    let MnemonicNumberKr = require('.');
    let mnum = new MnemonicNumberKr({
      shuffle: 'Any shuffle seed',
      dictionaries: ['animals.txt', 'test.txt']
    });

    mnum.on('load', () => {
      assert.ok(mnum.combinations > 0);
      assert.strictEqual(context.prevShuffled.length, mnum._dictionaries.length);

      for(let i=0; i<context.prevShuffled.length; i++) {
        assert.strictEqual(context.prevShuffled[i].length, mnum._dictionaries[i].length);

        for(let j=0; j<context.prevShuffled[i].length; j++) {
          assert.strictEqual(mnum._dictionaries[i][j], context.prevShuffled[i][j]);
        }
      }

      done();
    });
  });

  it('should en/decode numbers for all combinations with shuffled dictionaries', done  => {
    let MnemonicNumberKr = require('.');
    let mnum = new MnemonicNumberKr({
      shuffle: 'Any shuffle seed',
      dictionaries: [ 'animals.txt', 'test.txt' ]
    });

    mnum.on('load', () => {
      for(let i=0; i<mnum.combinations*3; i++) {
        let words = mnum.fromInteger(i);
        assert.strictEqual(words.length, 2);
        assert.strictEqual(mnum.toInteger(words), i%mnum.combinations);
      }

      done();
    });
  });
});

describe('from-to random', () => {
  it('should generate random and covert into integers', done  => {
    let MnemonicNumberKr = require('.');
    let mnum = new MnemonicNumberKr();

    mnum.on('load', () => {
      assert.ok(mnum.combinations > 0);
      let rand = mnum.random();
      assert.ok(rand);
      let int = mnum.toInteger(rand);
      let words = mnum.fromInteger(int);
      assert.strictEqual(words.length, rand.length);
      assert.strictEqual(words[0], rand[0]);

      done();
    });
  });
});
