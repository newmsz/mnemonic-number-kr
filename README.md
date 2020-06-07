# mnemonic-number-kr
숫자를 외우기 쉬운 한국어 단어로 변환, Converts numbers to predefined list of Korean words

## 설치 (Installation)

```
npm install mnemonic-number-kr
```

## 사용법 (Usage)

#### 기본 사용법 (Default usage)
```javascript
let mnum_basic = new MnemonicNumberKr();

mnum_basic.on('load', () => {
  console.log(mnum_basic.fromInteger(0)); // [ '하나', '하나' ]
  console.log(mnum_basic.fromInteger(1)); // [ '둘', '하나' ]
});
```

#### 배열 순서 섞기  (Shuffle array)
배열은 기본적으로 가나다순으로 정렬이 되있기에, 이를 무시하기 위해 배열을 섞는 방법
`seed`에 관한 자세한 내용은 https://github.com/webcaetano/shuffle-seed 참고

```javascript
let mnum_shuffled = new MnemonicNumberKr({
  shuffle: 'Any shuffle seed' // 아무 문자열이나 가능
});

mnum_shuffled.on('load', () => {
  console.log(mnum_shuffled.fromInteger(0)); // [ '둘', '둘' ]
  console.log(mnum_shuffled.fromInteger(1)); // [ '하나', '둘' ]
});
```

#### 출력 포멧 (Output format)
출력 포멧에 따라서 단어를 어떤식으로 사용할지 결정합니다. 예를 들면 `[word]` 일 경우 한 단어만을 사용하게되어 35,304개의 경우의 수 밖에 없지만, `[word]-[word]`와 같이 두 개의 단어를 사용하게되면 총 1,246,372,416개의 표현이 가능해집니다.

```javascript
let mnum_single_word = new MnemonicNumberKr({
  dictionaries: [ 'test.txt' ]
});

mnum_single_word.on('load', () => {
  console.log(mnum_single_word.combinations); // 3
  console.log(mnum_single_word.fromInteger(0)); // [ '하나' ]
});

let mnum_double_word = new MnemonicNumberKr({
  dictionaries: [ 'test.txt', 'test.txt' ]
});

mnum_double_word.on('load', () => {
  console.log(mnum_double_word.combinations) // 9 = 3*3
  console.log(mnum_double_word.fromInteger(0)); // [ '하나', '하나' ]
});
```

#### 경우의 수 주의 (Caution)
예상된 경우의 수보다 더 큰 숫자를 변환할 경우, 다시 복구할때 데이터 손실이 일어날 수 있습니다.
If you use larger number than the available combinations, you will lose the actual number data.

```javascript
let mnum = new MnemonicNumberKr({
  dictionaries: [ 'test.txt' ]
});

mnum.on('load', () => {
  console.log(mnum.combinations); // 3 (test.txt)

  for(let i=0; i<6; i++) {
    let words = mnum.fromInteger(i);
    console.log(i, words, mnum.toInteger(words))
  }

  // result:
  // 0 [ '둘', '둘' ] 0
  // 1 [ '하나', '둘' ] 1
  // 2 [ '둘', '하나' ] 2
  // 3 [ '하나', '하나' ] 3
  // 4 [ '둘', '둘' ] 0
  // 5 [ '하나', '둘' ] 1
});
```
