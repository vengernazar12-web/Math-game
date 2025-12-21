/*Music progress bar */ const musProgress = document.querySelector('.progress');
// Змінні для гри
let playerTurnMath = true,
playDiff = null,
corrAnswer = null,
PS = 0,
BS = 0,
badPlayerAnsSer = 0,
goodPlayerAnsSer = 0,
plusCoinsForGame = null;

// Reload skins-window
document.querySelector('.reload-all-skins').addEventListener('click', () => { setInitialGoals(); setPlayerSkins() })

// All containers/blocks
const selectDifficultWindow = document.querySelector('.math-game-difficulty-window');
const mathGameContent = document.querySelector('.game-content');
const contentBlock = document.querySelector('.content-block');
const helpWindow = document.querySelector('.helpWindow');
const statsWindow = document.querySelector('.stats-window');

const playerGoalsWindow = document.querySelector('.player-goals');

const skinWindow = document.querySelector('.math-new-skin-window');
const magazineWindow = document.querySelector('.magazine-content');
const backPackWindow = document.querySelector('.bagPack-for-products');

// Input answer (Текстове поле)
const inputAnswer = document.querySelector('.textAnswer');

// Opened btn ...
document.querySelector('.open-player-goals').addEventListener('click', () => {setInitialGoals(); playerGoalsWindow.classList.add('show')})

const openTextArea = document.querySelector('.open-text-area');

// open player stats
document.querySelectorAll('.player-stats, .player-stats3').forEach(v => v.addEventListener('click', () => {statsWindow.classList.add('show'); setAllStats()}))
// Open help window
const btnOpenHelpWindow = document.querySelector('.help');
// Open diff window
document.querySelector('.show-difficulty-window').addEventListener('click', () => selectDifficultWindow.classList.add('show'))
// Open skin window
document.querySelector('.open-skin-window').addEventListener('click', () => skinWindow.classList.add('show'))
// Open magazine
document.querySelector('.open-math-magazine').addEventListener('click', () => { checkAllMagazineBtns(); magazineWindow.classList.add('show')});
// Open backPack
document.querySelector('.open-math-backPack').addEventListener('click', () => { checkAllMagazineBtns(); backPackWindow.classList.add('show')});

// All btns/texts
const textAreaFromAnswer = document.querySelector('.text-area');

const localeCorrSer = document.querySelector('.corrSerries');

const scoreRecord = document.querySelector('.scoreRecord');
const whoTurn = document.querySelector('.turn');
const difficultyInfo = document.querySelector('.gameDifficulty');
const playerScore = document.querySelector('.playerScore');
const botScore = document.querySelector('.botScore');
const sendAnswerBtn = document.querySelector('.send-answer');

const btnOkay = document.querySelector('.okay');

const textContent = document.querySelector('.text-content');

const coinsText = document.querySelector('.coins');

const plusCoinsInfo = document.querySelector('.plus-coins-forDiff');

// Closes btn
// Close player-goals window
document.querySelector('.close-player-goals').addEventListener('click', () => playerGoalsWindow.classList.remove('show'))
// Close diff window
document.querySelector('.closeMathDifficultyWindow').addEventListener('click', () => selectDifficultWindow.classList.remove('show'));
// Close help window
document.querySelector('.closeHelpWindow').addEventListener('click', () => helpWindow.classList.remove('show'))
// Close stats window
document.querySelector('.close-stats-window').addEventListener('click', () => statsWindow.classList.remove('show'))
// Close skin window
document.querySelector('.close-skin-window').addEventListener('click', () => skinWindow.classList.remove('show'))
// Close magazine window
document.querySelector('.close-math-magazine').addEventListener('click', () => magazineWindow.classList.remove('show'));
// Close backPack window
document.querySelector('.close-math-backPack').addEventListener('click', () => backPackWindow.classList.remove('show'));
// Game loop
function gameLoopMath() {
if(playerTurnMath) getPlayerAnswer()
else getBotMove()
}

const allMathGames = document.querySelectorAll('.Math-game-btns');

// CorrectAnswer number
function ansNumber(OK) {
  if(OK) localStorage.setItem('corr-answer', +localStorage.getItem('corr-answer') + 1)
  else localStorage.setItem('bad-answer', +localStorage.getItem('bad-answer') + 1)
}

// Set initial record
function setInitialRecord() {
  const string = `${playDiff}-record`;
  if(PS > +localStorage.getItem(string)) localStorage.setItem(string, PS);
  scoreRecord.textContent = `⭐🏆🥇 Рекорд цього рівня: ${+localStorage.getItem(string)} 🥇🏆⭐`;
}

// Get random number function
function randInt(min,max) {
  if(PS >= 25) { min *= 1.1; max *= 1.1; }
  if(PS >= 75) { min *= 1.1; max *= 1.1; }
  if(PS > 110) { min *= 1.1; max *= 1.1; }

  min = Math.round(min);
  max = Math.round(max);

  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Get random operators
function randOp(...ops) { return ops[Math.floor(Math.random() * ops.length)] }

// Bot reaction function
function botAnswerText(CORRECTANSWER, ...ARGS){
  const CORRECT = Math.random() > 0.9 ? false : true;
  textContent.classList.remove('textAnimStart')
  void textContent.offsetWidth;
  if(CORRECT){
  textContent.textContent = `Боту попався ось такий приклад: ${ARGS.join(' ')}?
Бот відповів: ${CORRECTANSWER}\nЦе правильна відповідь!`;
  botScore.textContent = `🤖 Бот: ${++BS}`;
  }
  else textContent.textContent = `Боту попався ось такий приклад: ${ARGS.join(' ')}?
Бот відповів: ${CORRECTANSWER + Math.floor(Math.random() * 15 + 1)}\nЦе НЕ правильна відповідь!`;
  textContent.classList.add('textAnimStart')
}

// Get bot move
function getBotMove() {
  contentBlock.classList.add('speckAnim')
  let cAnswer = null;
if(playDiff === 'easy') {
  const num1 = randInt(1, 150)
  const num2 = randInt(1, 150)
  const op = randOp('-', '+')
  cAnswer = op === '-' ? num1 - num2 : num1 + num2
  botAnswerText(cAnswer, num1, op, num2)
}
if(playDiff === 'medium') {
  const n = Math.random()
  if(n > 0.65) { // Множення/ділення
    const op = randOp('/', '*')
    let num1 = randInt(2, 20);
    const num2 = op == '/' ? num1 * randInt(2, 20) : randInt(2, 20);
    if(op === '/') num1 *= num2;
    cAnswer = op === '/' ? num1 / num2 : num1 * num2
    botAnswerText(cAnswer, num1, op, num2)
  }
  else if(n > 0.35) { // Плюс/мінус
    const num1 = randInt(25, 650)
    const num2 = randInt(25, 650)
    const op = randOp('-', '+')
    cAnswer = op === '+' ? num1 + num2 : num1 - num2
    botAnswerText(cAnswer, num1, op, num2)
  }
  else { // Rounding
    let num = randInt(50, 100) + Math.random()
    num = +num.toFixed(5)
    cAnswer = +num.toFixed(1)
    botAnswerText(cAnswer, 'Округліть ось це число до дисятої(0.1): ', num)
  }
}
if(playDiff === 'hard') {
  const rand = Math.random()
  if(rand > 0.7) { // Додати/відняти
    const op = randOp('-', '+')
    const num1 = randInt(175, 1350)
    const num2 = randInt(175, 1350)
    cAnswer = op === '+' ? num1 + num2 : num1 - num2
    botAnswerText(cAnswer, num1, op, num2)
  }
  else if(rand > 0.55) { // Помножити/поділити
    const op = randOp('*', '/')
    const num2 = randInt(10, 40)
    const num1 = op === '*' ? randInt(10, 40) : randInt(10, 40) * num2
    cAnswer = op === '*' ? num1 * num2 : num1 / num2;
    botAnswerText(cAnswer, num1, op, num2)
  }
  else if(rand > 0.22) { // Скільки відсотків/остача
    if(Math.random() > 0.5) { // Відсотки
      let num1 = randInt(20, 200)
      num1 = num1 - (num1 % 10)
      let num2 = randInt(70, 350)
      num2 = num2 - (num2 % 10)
      cAnswer = +(num2 * (num1 / 100)).toFixed(2)
      botAnswerText(cAnswer, num1 + '%', num2)
    }
    else { // Остача
      const num1 = randInt(80, 275)
      const num2 = randInt(3, 70)
      cAnswer = Math.round(num1 % num2)
      botAnswerText(cAnswer, 'Скільки залишиться при діленні', num1, 'на', num2)
    }
  }
  else { // Rounding
    const num = randInt(150, 350) + Math.random()
    if(Math.random() > 0.5) {
      cAnswer = +num.toFixed(3)
      botAnswerText(cAnswer, 'Округліть ось це число до тисячної(0.001): ', num)
    }
    else {
      cAnswer = +num.toFixed(2)
      botAnswerText(cAnswer, 'Округліть ось це число до сотої(0.01): ', num)
    }
  }
}
if(playDiff === 'megaHard') {
  const randNum = Math.random()
  if(randNum > 0.8) { // Змішані приклади
    const op1 = randOp('-', '+', '*')
    const op2 = randOp('-', '+', '*')
    const op3 = randOp('-', '+', '*')

    let percentNum = randInt(25, 250)
    percentNum = percentNum - (percentNum % 5)

    const num1 = op1 === '*' ? randInt(15, 110) : randInt(70, 1300)
    const num2 = op1 === '*' || op2 === '*' ? randInt(15, 110) : randInt(70, 1300)
    const num3 = op2 === '*' || op3 === '*' ? randInt(15, 110) : randInt(70, 1300)
    const num4 = op3 === '*' ? randInt(15, 110) : randInt(70, 1300)

    const numsResult = Math.round(eval(`${num1}${op1}${num2}${op2}${num3}${op3}${num4}`))
    const cAnswer = +(numsResult * (percentNum / 100)).toFixed(2)

    botAnswerText(cAnswer, 'Скільки буде', percentNum + '%', 'від (', num1, op1, num2, op2, num3, op3, num4, ')')
  }
  else if(randNum > 0.6) { // Percent
    let percentNum = randInt(15, 250)
    percentNum = percentNum - (percentNum % 5)
    let num = randInt(50, 1000)
    num = num - (num % 5)
    cAnswer = +(num * (percentNum / 100)).toFixed(2)
    botAnswerText(cAnswer, 'Скільки буде', percentNum + '%', 'від', num)
  }
  else if(randNum > 0.4) { // Залишок
    const num1 = randInt(750, 1750)
    const num2 = randInt(11, 500)
    cAnswer = num1 % num2
    botAnswerText(cAnswer, 'Який залишок при діленні', num1, 'на', num2)
  }
  else if(randNum > 0.2) { // Квадратний корінь
    let num1 = randInt(15, 35)
    num1 = num1 ** 2
    cAnswer = Math.sqrt(num1)
    botAnswerText(cAnswer, 'Скільки дорівнює квадратний корінь із √', num1)
  }
  else { // rounding
  const num2 = randInt(5, 30);
  const num1 = randInt(5, 30) * num2;
  let result = num1 / num2 + Math.random();
  const decimals = Math.random() > 0.5 ? 3 : 4;
  cAnswer = +result.toFixed(7);

  botAnswerText( cAnswer, 'Обчисліть ось цей вираз:', `(${num1} / ${num2}) + ${ (result - num1 / num2).toFixed(decimals) }`, `Та відповідь округліть до ${decimals === 3 ? 'тисячної(0.001)' : 'десятиТисячної(0.0001)'}`);
  }
}
setTimeout(() => {contentBlock.classList.remove('speckAnim'); btnOkay.classList.add('show')}, 2500);
}

// Math game FUNCTION
function MathGame(v) {
  playDiff = v;
  PS = 0; BS = 0; badPlayerAnsSer = 0; goodPlayerAnsSer = 0;
  inputAnswer.value = '';
  localeCorrSer.textContent = `Ваша найбільша серія правильних відповідей: ${+localStorage.getItem('c-pl-ans-ser')}`;
  whoTurn.textContent = '🔄 Хід: Гравець';
  difficultyInfo.textContent = `🎮 Рівень: ${playDiff}`;
  botScore.textContent = 'Ще немає відповідей';
  playerScore.textContent = 'Ще немає відповідей';
  btnOkay.classList.remove('show');
  if(playDiff.toLowerCase().includes('hard')) btnOpenHelpWindow.classList.add('show');
  playerTurnMath = true;
  localStorage.setItem('play-number', +localStorage.getItem('play-number') + 1);
  plusCoinsForGame = playDiff === 'easy' ? 7 : playDiff === 'medium' ? 12 : playDiff === 'hard' ? 25 : 40
  if(localStorage.getItem('dblCoins') === 'buy') plusCoinsForGame *= 2;
  plusCoinsInfo.textContent = `За відповідь + ${plusCoinsForGame}`;
  setInitialRecord();
  getPlayerAnswer();
}

// Get player answer and generator
function getPlayerAnswer(){
sendAnswerBtn.classList.add('show')
inputAnswer.classList.add('show')
inputAnswer.focus();
textContent.classList.remove('textAnimStart')
void textContent.offsetWidth;
generateMath()
}
function generateMath() {
if(playDiff === 'easy') {
  let num1 = randInt(1, 150)
  let num2 = randInt(1, 150)
  let op = randOp('-','+')
  corrAnswer = op === '-' ? num1 - num2 : num1 + num2
  textContent.textContent = `Скільки буде ${num1} ${op} ${num2}?`
}
else if(playDiff === 'medium') {
  const n = Math.random()
  if(n > 0.65) { // Множення/ділення
    const op = randOp('*','/')
    const num2 = randInt(2, 20)
    const num1 = op === '/' ? num2 * randInt(2, 20) : randInt(2, 20)
    corrAnswer = op === '/' ? num1 / num2 : num1 * num2
    textContent.textContent = `Скільки буде ${num1} ${op} ${num2}?`
  }
  else if(n > 0.35) { // Додавання/віднімання
    const op = randOp('+', '-')
    const num1 = randInt(25, 650)
    const num2 = randInt(25, 650)
    corrAnswer = op === '-' ? num1 - num2 : num1 + num2;
    textContent.textContent = `Скільки буде ${num1} ${op} ${num2}?`
  }
  else { // Rounding
    let num = randInt(50, 100) + Math.random()
    num = +num.toFixed(5)
    corrAnswer = +num.toFixed(1)
    textContent.textContent = 'Округліть ось це число до дисятої(0.1): ' + num
    return;
  }
}
else if(playDiff === 'hard') {
  let rand = Math.random()
  if(rand > 0.7) { // Додати/відняти
    const op = randOp('+','-')
    const num1 = randInt(175, 1350)
    const num2 = randInt(175, 1350)
    corrAnswer = op === '+' ? num1 + num2 : num1 - num2
    textContent.textContent = `Скільки буде ${num1} ${op} ${num2}?`
  }
  else if(rand > 0.55) { // Помножити/поділити
    op = randOp('*','/')
    num2 = randInt(10, 40)
    num1 = op === '*' ? randInt(10, 40) : randInt(10, 40) * num2
    corrAnswer = op === '*' ? num1 * num2 : num1 / num2;
    textContent.textContent = `Скільки буде ${num1} ${op} ${num2}?`
  }
  else if(rand > 0.22) { // Скільки Відсотки/остача
    let n = Math.random()
    if(n > 0.5) { // Відсотки
      num1 = randInt(20, 200)
      num1 = num1 - (num1 % 10)
      num2 = randInt(70, 350)
      num2 = num2 - (num2 % 10)
      op = '%'
      corrAnswer = +(num2 * (num1 / 100)).toFixed(2)
      textContent.textContent = `Скільки буде ${num1}% від ${num2}?`
    }
    else { // Остача
      num1 = randInt(80, 275)
      num2 = randInt(3, 70)
      op = 'ost'
      corrAnswer = num1 % num2
      textContent.textContent = `Скільки залишається при ділені ${num1} на ${num2}?`
    }
  }
  else { // Rounding
    const num = randInt(150, 350) + Math.random()

    if(Math.random() > 0.5) {
      corrAnswer = +num.toFixed(3)
      textContent.textContent = `Округліть ось це число до тисячної(0.001): ${num}`
    }
    else {
      corrAnswer = +num.toFixed(2)
      textContent.textContent = `Округліть ось це число до сотої(0.01): ${num}`
    }
  }
}
else if (playDiff === 'megaHard') {
  const randNum = Math.random()
  if(randNum > 0.8) { // Змішані приклади
    const op1 = randOp('+','-','*')
    const op2 = randOp('+','-','*')
    const op3 = randOp('+','-','*')

    let percentNum = randInt(25, 250)
    percentNum = percentNum - (percentNum % 5)

    const num1 = op1 === '*' ? randInt(15, 110) : randInt(70, 1300)
    const num2 = op1 === '*' || op2 === '*' ? randInt(15, 110) : randInt(70, 1300)
    const num3 = op2 === '*' || op3 === '*' ? randInt(15, 110) : randInt(70, 1300)
    const num4 = op3 === '*' ? randInt(15, 110) : randInt(70, 1300)

    const numsResult = Math.round(eval(`${num1}${op1}${num2}${op2}${num3}${op3}${num4}`))
    corrAnswer = +(numsResult * (percentNum / 100)).toFixed(2)

    textContent.textContent = `Скільки буде ${percentNum}% від (${num1} ${op1} ${num2} ${op2} ${num3} ${op3} ${num4})?`
  }
  else if(randNum > 0.6) { // Percent
    let percentNum = randInt(15, 250)
    percentNum = percentNum - (percentNum % 5)
    let num = randInt(50, 1000)
    num = num - (num % 5)
    corrAnswer = +(num * (percentNum / 100)).toFixed(2)

    textContent.textContent = `Скільки буде ${percentNum}% із ${num}?`
  }
  else if(randNum > 0.4) { // Залишок при діленні
    const num1 = randInt(750, 1750)
    const num2 = randInt(11, 500)
    corrAnswer = num1 % num2

    textContent.textContent = `Який залишок при ділені ${num1} на ${num2}?`
  }
  else if(randNum > 0.2) { // Корінь
    let num1 = randInt(15, 35)
    num1 = num1 ** 2
    corrAnswer = Math.sqrt(num1)

    textContent.textContent = `Скільки дорівнює квадратний корінь із √${num1}?`
  }
  else { // rounding
  const num2 = randInt(5, 30);
  const num1 = randInt(5, 30) * num2;
  let result = num1 / num2 + Math.random();
  const decimals = Math.random() > 0.5 ? 3 : 4;
  corrAnswer = +result.toFixed(decimals);

  textContent.textContent = `Обчисліть ось цей вираз: (${num1} / ${num2}) + ${ (result - num1 / num2) } Та відповідь округліть до ${decimals === 3 ? 'тисячної(0.001)' : 'десятиТисячної(0.0001)'}`
  }
}
textContent.classList.add('textAnimStart')
}

// All stats information
const allPlayNum = document.querySelector('.allPlayNum')
const corrAnsNum = document.querySelector('.corrAnsNum')
const badAnsNum = document.querySelector('.badAnsNum')
const ansPercent = document.querySelector('.answer-percent')
const correctAnsSer = document.querySelector('.correct-answer-ser')
const badAnsSer = document.querySelector('.bad-answer-ser')

const easyRecord = document.querySelector('.easy-record-num')
const medRecord = document.querySelector('.medium-record-num')
const hardRecord = document.querySelector('.hard-record-num')
const megaHardRecord = document.querySelector('.megaHard-record-num')
const bigRecordNum = document.querySelector('.big-record-num')

function setAllStats() {
  const corr = +localStorage.getItem('corr-answer');
  const bad = +localStorage.getItem('bad-answer');
  const total = corr + bad;

  allPlayNum.textContent = `🎮 Всього зіграно ігор: ${+localStorage.getItem('play-number')}`
  corrAnsNum.textContent = `✅ Всього правильних відповідей: ${corr}`
  badAnsNum.textContent = `❌ Всього неправильних відповідей: ${bad}`
  ansPercent.textContent = `🎯 Відсоток правильних відповідей: ${(total === 0 ? 0 : (corr / total) * 100).toFixed(2)}%`
  correctAnsSer.textContent = `Ваша найбільша серія правильних відповідей: ${+localStorage.getItem('c-pl-ans-ser')}`
  badAnsSer.textContent = `Ваш найбільший анти-рекорд ${+localStorage.getItem('b-pl-ans-ser')} неправильних відповідей поспіль`

  easyRecord.textContent = `Ваш рекорд в 🟩легкому режимі: ${+localStorage.getItem('easy-record')}`
  medRecord.textContent = `Ваш рекорд в 🟦середньому режимі: ${+localStorage.getItem('medium-record')}`
  hardRecord.textContent = `Ваш рекорд в 🟧тяжкому режимі: ${+localStorage.getItem('hard-record')}`
  megaHardRecord.textContent = `Ваш рекорд в 🟥мегаТяжкому режимі: ${+localStorage.getItem('megaHard-record')}`
  bigRecordNum.textContent = `Ваш найбільший рекорд: ${Math.max(+localStorage.getItem('easy-record'), +localStorage.getItem('medium-record'), +localStorage.getItem('hard-record'), +localStorage.getItem('megaHard-record'))}`
}

// All goals stats
/* All goals block */
const goalPercent = document.querySelector('.goal-percent');
const h2 = goalPercent.querySelector('h2');
const p = goalPercent.querySelector('p');
const percentsInfo = [
  {max: 10, h2: '🐢 Слабий в матиматиці 🐢', p: 'Ваш відсоток правильних відповідей менший 10%! ❌'},
  {max: 25, h2: '🐤 Неопитний в матиматиці 🐤', p: 'Ваш відсоток правильних відповідей менший 25%! ❌'},
  {max: 50, h2: '🟡 Чучуть розуміющий матиматику 🟡', p: 'Ваш відсоток правильних відповідей менший 50%! 🟡', class: 'almostPassed'},
  {max: 75, h2: '🦉 Прошарений в матиматиці 🦉', p: 'Ваш відсоток правильних відповідей менший 75%! ✅', class: 'passed'},
  {max: 100, h2: '🤯 Мега-мозок в матиматиці 🤯', p: 'Ваш відсоток правильних відповідей дуже високий! ✅', class: 'passed'},
];

const allClassicSkin = Array.from(document.querySelectorAll('.classic-skin'));
const goalGetAllClassicSkinBlock = document.querySelector('.get-classic-skin-goals-blocks');
const goalGetAllClassicSkinTxt = goalGetAllClassicSkinBlock.querySelector('p:last-of-type');

const getAllDiffRecordOne = document.querySelector('.goal-allDiffRecord-one');
const getAllDiffRecordOneTXT = getAllDiffRecordOne.querySelector('p:last-of-type');

const allGoalsForDataArray =
Array.from(document.querySelectorAll('.all-gameNum-goals-blocks > div, .all-records-goals-blocks > div, .all-badSerries-goals-blocks > div, .all-corrSerries-goals-blocks > div, .all-corr-answer-goals-block > div'))
.map(v => {
  const asc = v.dataset.goalAsc,
  need = +v.dataset.goalNeed,
  txt = v.querySelector('p:last-of-type');
  return {asc, need, txt, block: v}
})

function setInitialGoals() {
  allGoalsForDataArray.forEach(v => { v.txt.textContent = 'Не розблоковано! ❌'; v.block.classList.remove('passed') });
  goalPercent.classList.remove('passed', 'almostPassed');
  goalGetAllClassicSkinBlock.classList.remove('passed');
  goalGetAllClassicSkinTxt.textContent = 'Не розблоковано! ❌';
  getAllDiffRecordOne.classList.remove('passed');
  getAllDiffRecordOneTXT.textContent = 'Не розблоковано! ❌';

  for(let i of allGoalsForDataArray) {
    if(+localStorage.getItem(i.asc) >= i.need) {
      i.txt.textContent = 'Розблоковано! ✅';
      i.block.classList.add('passed');
    }
  }

  const c = +localStorage.getItem('corr-answer'), b = +localStorage.getItem('bad-answer');
  const t = c + b;
  const cp = t === 0 ? 0 : (c / t) * 100;

  for(let i of percentsInfo) {
    if(cp <= i.max) {
      h2.textContent = i.h2;
      p.textContent = i.p;
      if(i.class) goalPercent.classList.add(i.class)
      break;
    }
  }
  // Get all classic skin
  if(allClassicSkin.every(v => v.classList.contains('passed') || v.classList.contains('active'))) {
    goalGetAllClassicSkinBlock.classList.add('passed')
    goalGetAllClassicSkinTxt.textContent = 'Розблоковано! ✅'
  }
  // Get all diff record >= 1
  if(+localStorage.getItem('easy-record') >= 1 && +localStorage.getItem('medium-record') >= 1 && +localStorage.getItem('hard-record') >= 1 && +localStorage.getItem('megaHard-record') >= 1) {
    getAllDiffRecordOne.classList.add('passed')
    getAllDiffRecordOneTXT.textContent = 'Розблоковано! ✅'
  }
}


// Show new goals function
const blockForShowNewGoal = document.querySelector('.show-new-goals-block');
const showNewGoalTxt = blockForShowNewGoal.querySelector('pre');

const allGoalsForShow = Array.from(document.querySelectorAll('.--forShow'));

function showNewGoals() {
  if(!allGoalsForShow.every(v => v.classList.contains('showed'))) {
    for(let i = 0; i < allGoalsForShow.length; i++) {
      if(!allGoalsForShow[i].classList.contains('showed') && localStorage.getItem(i)) allGoalsForShow[i].classList.add('showed');

      if(!allGoalsForShow[i].classList.contains('showed') && allGoalsForShow[i].classList.contains('passed')) {
        allGoalsForShow[i].classList.add('showed');
        localStorage.setItem(i, i);

        showNewGoalTxt.textContent = `Ви розблокували нове досягнення:\n${allGoalsForShow[i].querySelector('h2').textContent}!`

        blockForShowNewGoal.classList.remove('show-new-goal');
        void blockForShowNewGoal.offsetWidth;
        blockForShowNewGoal.classList.add('show-new-goal');
        break;
      }
    }
  }
}


// All themes (skins) function
const SPECIAL_SKINS = ['math-gold-cyber', 'math-gold-royal', 'math-ice-skin', 'math-hardcore', 'math-master-bronze', 'math-master-silver', 'math-master-gold'];

/* All skins blcoks array */ const allSkinsBlocks = Array.from(document.querySelectorAll('.math-new-skin-window > div'))
/* All skins btns array */const allSkinsBtns = allSkinsBlocks.map(v => v.querySelector('button'));

function setPlayerSkins() {
  if(localStorage.getItem('gold-border') === 'true') document.body.classList.add('gold-border-active');
  const savedSkin = localStorage.getItem('activeSkin');

  if(savedSkin) {
    document.documentElement.classList.add(savedSkin);
    allSkinsBlocks.forEach(v => v.classList.remove('active'))
    const activeBlock = allSkinsBtns.find(b => b.dataset.skin === savedSkin)?.parentElement;
    if(activeBlock) activeBlock.classList.add('active')
  }
  for(let i = 0; i < allSkinsBlocks.length - 7; i++) {
    if(+localStorage.getItem(allSkinsBlocks[i].dataset.skinAsc) >= +allSkinsBlocks[i].dataset.skinNumber) {
      allSkinsBlocks[i].classList.add('passed');
      allSkinsBtns[i].disabled = false;
    }
    else {
      allSkinsBlocks[i].classList.remove('passed');
      allSkinsBtns[i].disabled = true;
      allSkinsBlocks[i].classList.remove('passed', 'active')
      if(localStorage.getItem('activeSkin') === allSkinsBtns[i].dataset.skin) document.documentElement.classList.remove(allSkinsBtns[i].dataset.skin)
    }
  }
  checkSpecialSkins()
}

const allBlocksForUnlockHardcoreSkin = Array.from(document.querySelectorAll('.--for-unlock-hardcor-skin > div'))

const cyberGoldSkinBlock = document.querySelector('.cyber-gold');
const cyberGoldSkinBtn = cyberGoldSkinBlock.querySelector('button');
const royalGoldSkinBlock = document.querySelector('.royal-gold');
const royalGoldSkinBtn = royalGoldSkinBlock.querySelector('button');
const iceSkinBlock = document.querySelector('.ice-skin');
const iceSkinBtn = iceSkinBlock.querySelector('button');
const hardcoreSkinBlock = document.querySelector('.hardcore-skin');
const hardcoreSkinBtn = hardcoreSkinBlock.querySelector('button');

const mathBronzeMasterBlock = document.querySelector('.math-master-bronze-skin');
const mathBronzeMasterBtn = mathBronzeMasterBlock.querySelector('button');
const mathSilverMasterBlock = document.querySelector('.master-silver-skin');
const mathSilverMasterBtn = mathSilverMasterBlock.querySelector('button');
const mathGoldMasterBlock = document.querySelector('.math-master-gold-skin');
const mathGoldMasterSkinBtn = mathGoldMasterBlock.querySelector('button');

const allSpecialSkinsBlocks = [
  cyberGoldSkinBlock,
  royalGoldSkinBlock,
  iceSkinBlock,
  hardcoreSkinBlock,
  mathGoldMasterBlock,
  mathBronzeMasterBlock,
  mathSilverMasterBlock
]

const allSpecialSkinsBtns = [
  cyberGoldSkinBtn,
  royalGoldSkinBtn,
  iceSkinBtn,
  hardcoreSkinBtn,
  mathGoldMasterSkinBtn,
  mathBronzeMasterBtn,
  mathSilverMasterBtn
]

function checkSpecialSkins() {
  const corrSerr = +localStorage.getItem('c-pl-ans-ser'),
  badAns = +localStorage.getItem('bad-answer'),
  corrAns = +localStorage.getItem('corr-answer'),
  totalAns = badAns + corrAns,
  corrPercent = totalAns === 0 ? 0 : (corrAns / totalAns) * 100,
  hard = +localStorage.getItem('hard-record'),
  megaHard = +localStorage.getItem('megaHard-record');

  document.documentElement.classList.remove(...SPECIAL_SKINS)

  allSpecialSkinsBlocks.forEach(v => v.classList.remove('passed', 'active'))
  allSpecialSkinsBtns.forEach(v => v.disabled = true)
  // Cyber gold skin
  if(corrPercent >= 50 && hard >= 100 && megaHard >= 20 && corrSerr >= 25) {
    cyberGoldSkinBtn.disabled = false;
    if(localStorage.getItem('activeSkin') === 'math-gold-cyber') {
      document.documentElement.classList.add('math-gold-cyber');
      cyberGoldSkinBlock.classList.add('active');
    }
    else cyberGoldSkinBlock.classList.add('passed');
  }
  // Royal gold skin
  if(corrPercent >= 75 && hard >= 150 && megaHard >= 100 && +localStorage.getItem('play-number') >= 50 && corrSerr >= 50) {
    royalGoldSkinBtn.disabled = false;
    if(localStorage.getItem('activeSkin') === 'math-gold-royal') {
      document.documentElement.classList.add('math-gold-royal');
      royalGoldSkinBlock.classList.add('active')
    }
    else royalGoldSkinBlock.classList.add('passed');
  }
  // Ice skin
  if(corrAns >= 200 && hard >= 25 && corrSerr >= 50) {
    iceSkinBtn.disabled = false;
    if(localStorage.getItem('activeSkin') === 'math-ice-skin') {
      document.documentElement.classList.add('math-ice-skin')
      iceSkinBlock.classList.add('active')
    }
    else iceSkinBlock.classList.add('passed')
  }
  const allClassicSkinUnlock = allClassicSkin.every(v => v.classList.contains('passed') || v.classList.contains('active'))
  // Hardcore skin
  if(allBlocksForUnlockHardcoreSkin.every(v => v.classList.contains('passed'))) {
    hardcoreSkinBtn.disabled = false;
    if(localStorage.getItem('activeSkin') === 'math-hardcore') {
      document.documentElement.classList.add('math-hardcore')
      hardcoreSkinBlock.classList.add('active')
    }
    else hardcoreSkinBlock.classList.add('passed')
  }
  // Math bronze master skin
  if(allClassicSkinUnlock && corrAns >= 100 && corrPercent >= 25 && megaHard >= 25) {
    mathBronzeMasterBtn.disabled = false;
    if(localStorage.getItem('activeSkin') === 'math-master-bronze') {
      document.documentElement.classList.add('math-master-bronze')
      mathBronzeMasterBlock.classList.add('active')
    }
    else mathBronzeMasterBlock.classList.add('passed')
  }
  // Math silver master skin
  if(allClassicSkinUnlock && corrAns >= 176 && corrPercent >= 40 && megaHard >= 50) {
    mathSilverMasterBtn.disabled = false;
    if(localStorage.getItem('activeSkin') === 'math-master-silver') {
      document.documentElement.classList.add('math-master-silver')
      mathSilverMasterBlock.classList.add('active')
    }
    else mathSilverMasterBlock.classList.add('passed')
  }
  // Math gold master skin
  if(allClassicSkinUnlock && corrPercent >= 50 && corrAns >= 250 && megaHard >= 65) {
    mathGoldMasterSkinBtn.disabled = false;
    if(localStorage.getItem('activeSkin') === 'math-master-gold') {
      document.documentElement.classList.add('math-master-gold')
      mathGoldMasterBlock.classList.add('active')
    }
    else mathGoldMasterBlock.classList.add('passed')
  }
}

// Coins functions
const allMagazineBtns = Array.from(document.querySelectorAll('.--magazine-block > button'));
const allMagazineSkins = allMagazineBtns.map(v => v.dataset.id);

const allSkinAndItemsName = [...allSkinsBtns.map(v => v.dataset.skin.replace('math-', '')), ...allMagazineBtns.map(v => v.dataset.id.replace('math-'))]

// Wallet
function wallet() {
  localStorage.setItem('coins', +localStorage.getItem('coins') + plusCoinsForGame);
  coinsText.textContent = localStorage.getItem('coins');

  coinsText.classList.remove('plus-coins-anim');
  void coinsText.offsetWidth;
  coinsText.classList.add('plus-coins-anim');
}

// Check all magazine product and add product to bagPack
function checkAllMagazineBtns() {
  allMagazineBtns.forEach(v => {
    if(v.classList.contains('appended')) return;
    else if(localStorage.getItem(v.dataset.id) === 'buy') {
      v.disabled = true;
      v.textContent = 'Куплено';

      const div = document.createElement('div');
      div.setAttribute('data-product', v.dataset.id);
      div.classList.add('--math-mini-block', '--backPack-block');
      if(v.classList.contains('magazine-cursor-btn')) div.classList.add('back-pack-cursor')

      const btn = document.createElement('button');
      btn.textContent = 'Використати';
      if(v.dataset.id === 'gold-border-active') {
        div.classList.add('backPack-goldBorder-block')
        if(localStorage.getItem('gold-border') === 'true') btn.textContent = 'Вимкнути'
      };
      btn.dataset.id = v.dataset.id;
      btn.classList.add('--math-btn', '--backPack-btn');
      const h2E = document.createElement('h2');
      h2E.textContent = v.dataset.backPackName;
      div.appendChild(h2E);
      div.appendChild(btn);
      if(btn.dataset.id === 'musics' || btn.dataset.id === 'dblCoins') {div.removeChild(btn); div.classList.add('back-pack-spec')}
      backPackWindow.appendChild(div);
      v.classList.add('appended');
    }
    else {
      v.disabled = false;
      v.textContent = v.dataset.price;
    }
  }
  )
}

// All no-magazine products
const pDiffNums = { 1: 'easy', 2: 'medium', 3: 'hard', 4: 'megaHard' }

// Делегування
document.querySelectorAll('.magazine-skin-blocks, .magazine-cursor-blocks').forEach(v => v.addEventListener('click', e => {
  if(e.target.tagName === 'BUTTON') {
    const magSkin = e.target.dataset.magSkin,
    magSkinNeed = e.target.dataset.magSkinNeed;
    if(+localStorage.getItem('coins') < +e.target.dataset.price) return alert('Вам не вистачає монет!');
    if(magSkin) if(+localStorage.getItem(magSkin) < +magSkinNeed) return alert('У вас не виконані вимоги!');
    localStorage.setItem('coins', +localStorage.getItem('coins') - +e.target.dataset.price);
    localStorage.setItem(e.target.dataset.id, 'buy')
    coinsText.textContent = localStorage.getItem('coins')
    e.target.disabled = true;
    e.target.textContent = 'Куплено';

    coinsText.classList.remove('minus-coins-anim');
    void coinsText.offsetWidth;
    coinsText.classList.add('minus-coins-anim');
  }
}))

document.querySelector('.gold-border')
.addEventListener('click', e => {
  if(+localStorage.getItem('coins') < +e.target.dataset.price) return alert('Вам не вистачає монет!');

  localStorage.setItem('coins', +localStorage.getItem('coins') - e.target.dataset.price);
  coinsText.textContent = localStorage.getItem('coins');
  e.target.disabled = true;
  e.target.textContent = 'Куплено';
  localStorage.setItem(e.target.dataset.id, 'buy');

  coinsText.classList.remove('minus-coins-anim');
  void coinsText.offsetWidth;
  coinsText.classList.add('minus-coins-anim');
})
document.querySelector('.musics')
.addEventListener('click', e => {
  if(+localStorage.getItem('coins') < e.target.dataset.price) return alert('Вам не хватає монет');
  localStorage.setItem('coins', +localStorage.getItem('coins') - +e.target.dataset.price)
  coinsText.textContent = localStorage.getItem('coins')
  e.target.disabled = true;
  e.target.textContent = 'Куплено'
  localStorage.setItem(e.target.dataset.id, 'buy');
  musProgress.classList.add('show');

  coinsText.classList.remove('minus-coins-anim');
  void coinsText.offsetWidth;
  coinsText.classList.add('minus-coins-anim');
})
document.querySelector('.dblCoins')
.addEventListener('click', e => {
  if(+localStorage.getItem('coins') < e.target.dataset.price) return alert('Вам не хватає монет');
  localStorage.setItem('coins', +localStorage.getItem('coins') - e.target.dataset.price);
  coinsText.textContent = localStorage.getItem('coins')
  e.target.disabled = true;
  e.target.textContent = 'Куплено';
  localStorage.setItem(e.target.dataset.id, 'buy');
  plusCoinsInfo.classList.add('dbl-active-text');

  coinsText.classList.remove('minus-coins-anim');
  void coinsText.offsetWidth;
  coinsText.classList.add('minus-coins-anim');
})

skinWindow.addEventListener('click', e => {
  if(e.target.classList.contains('--skin-btn')) {
    document.documentElement.classList.remove(document.documentElement.classList[0]);
    document.documentElement.classList.add(e.target.dataset.skin)
    allSkinsBlocks.find(b => b.classList.contains('active'))?.classList.remove('active')
    e.target.parentElement.classList.add('active');
    localStorage.setItem('activeSkin', e.target.dataset.skin)
    checkSpecialSkins()
  }
})
backPackWindow.addEventListener('click', e => {
  const targId = e.target.dataset.id;
  if(e.target.tagName === 'BUTTON' && e.target.parentElement.classList.contains('back-pack-cursor')) {
    document.body.classList.remove(localStorage.getItem('activeCursor'));
    document.body.classList.add(targId);
    localStorage.setItem('activeCursor', targId);
  }
  else if(e.target.tagName === 'BUTTON' && e.target.classList.contains('--backPack-btn') && !e.target.parentElement.classList.contains('backPack-goldBorder-block')) {
    document.documentElement.classList.remove(localStorage.getItem('activeSkin'));
    document.documentElement.classList.add(targId);
    localStorage.setItem('activeSkin', targId);
  }
  else if(e.target.tagName === 'BUTTON' && e.target.parentElement.classList.contains('backPack-goldBorder-block')) {
    const isActive = document.body.classList.toggle(targId);
    localStorage.setItem('gold-border', isActive);
    e.target.textContent = isActive ? 'Вимкнути' : 'Використати';
  }
})
const btnStartEasyGame = document.querySelector('[data-math-level="easy"]');
const btnStartMediumGame = document.querySelector('[data-math-level="medium"]');
const btnStartHardGame = document.querySelector('[data-math-level="hard"]');
const btnStartMegaHardGame = document.querySelector('[data-math-level="megaHard"]');
selectDifficultWindow.addEventListener('click', e => {
  if(e.target.classList.contains('Math-game-btns')) {
    mathGameContent.classList.add('show')
    MathGame(e.target.dataset.mathLevel)
  }
})

mathGameContent.addEventListener('click', ({target: {classList}}) => {
  if(!classList.length) return;
  if(classList.contains('skip-math-asc')) {
    if(+localStorage.getItem('coins') - 90 < 0) alert('У вас не хватає монет');
    else { localStorage.setItem('coins', +localStorage.getItem('coins') - 90); generateMath(); coinsText.textContent = localStorage.getItem('coins')}
  }
  else if(classList.contains('generate-easy-asc')) {
    if(+localStorage.getItem('coins') - 125 < 0) alert('У вас не хватає монет');
    else if(playDiff === 'easy') alert('Не можливо облегчити легкий приклад (У вас легкий режим)');
    else {
      localStorage.setItem('coins', +localStorage.getItem('coins') - 125);
      const initPDiffNum = playDiff === 'easy' ? 1 : playDiff === 'medium' ? 2 : playDiff === 'hard' ? 3 : 4;
      playDiff = pDiffNums[initPDiffNum - 1];
      generateMath();
      playDiff = pDiffNums[initPDiffNum];
      coinsText.textContent = localStorage.getItem('coins');
    }
  }
  else if(classList.contains('show-hint')) {
    if(+localStorage.getItem('coins') - 150 < 0 ) alert('У вас не хватає монет');
    else {
      localStorage.setItem('coins', +localStorage.getItem('coins') - 150);
      coinsText.textContent = localStorage.getItem('coins');
      alert(`Правильна відповідь в районі від: ${corrAnswer - Math.floor(Math.random() * 100)} до ${corrAnswer + Math.floor(Math.random() * 100)}`)
    }
  }
  else if(classList.contains('player-stats2')) { statsWindow.classList.add('show'); setAllStats() }
  else if(classList.contains('open-player-goals2')) { setInitialGoals(); playerGoalsWindow.classList.add('show') }
  else if(classList.contains('okay')) {
    btnOkay.classList.remove('show')
    playerTurnMath = !playerTurnMath;
    whoTurn.textContent = playerTurnMath ? '🔄 Хід: Гравець' : '🔄 Хід: Бот'
    inputAnswer.value = ''
    gameLoopMath()
  }
  else if(classList.contains('open-text-area')) {
    if(!textAreaFromAnswer.classList.contains('show')) {
    textAreaFromAnswer.classList.add('show');
    textAreaFromAnswer.focus();
    }
    else {
      textAreaFromAnswer.classList.remove('show');
      inputAnswer.focus()
    }
  }
  else if(classList.contains('help')) helpWindow.classList.add('show');
  else if(classList.contains('closeInitialGame')) {
    if(PS < 1 && BS < 1) localStorage.setItem('play-number', +localStorage.getItem('play-number') - 1)
    mathGameContent.classList.remove('show');
    inputAnswer.classList.remove('show');
    sendAnswerBtn.classList.remove('show');
    btnOkay.classList.remove('show');
    btnOpenHelpWindow.classList.remove('show');
    helpWindow.classList.remove('show');
    textAreaFromAnswer.classList.remove('show');
  }
  else if(classList.contains('send-answer')) {
    const playerValue = inputAnswer.value.trim().replace(/[^\d\.-]/g, '').replaceAll('--','-').replaceAll('..','.')
    if(!playerValue.length) { inputAnswer.value = ''; inputAnswer.focus(); return; };

    setInitialGoals(); showNewGoals();

    sendAnswerBtn.classList.remove('show')
    inputAnswer.classList.remove('show')
    textContent.classList.remove('textAnimStart')
    void textContent.offsetWidth;
    contentBlock.classList.remove('b-ans-anim', 'c-ans-anim')
    void contentBlock.offsetWidth;

    if(Number(playerValue) !== Number(corrAnswer)) { // Bad answer
      textContent.textContent = `Ви ввели неправильну відповідь!\n\nВаша відповідь: ${playerValue}\n\nПравильна відповідь була: ${corrAnswer}`;
      contentBlock.classList.add('b-ans-anim');

      badPlayerAnsSer++;
      if(+localStorage.getItem('b-pl-ans-ser') < badPlayerAnsSer) localStorage.setItem('b-pl-ans-ser', badPlayerAnsSer)

      goodPlayerAnsSer = 0;
      ansNumber(false);
    }
    else { // Correct answer
      textContent.textContent = `Ви правильно вирішили приклад!\n\nВідповідь: ${corrAnswer}`;
      playerScore.textContent = `👤 Гравець: ${++PS}`;
      contentBlock.classList.add('c-ans-anim');

      badPlayerAnsSer = 0;

      goodPlayerAnsSer++;
      if(+localStorage.getItem('c-pl-ans-ser') < goodPlayerAnsSer) {localStorage.setItem('c-pl-ans-ser', goodPlayerAnsSer); localeCorrSer.textContent = `Ваша найбільша серія правильних відповідей: ${+localStorage.getItem('c-pl-ans-ser')}`}

      setInitialRecord();
      ansNumber(true);

      wallet()
    }
    textContent.classList.add('textAnimStart')
    checkSpecialSkins()
    setTimeout(() => btnOkay.classList.add('show'), 2500);
  }
  else if(classList.contains('open-math-backPack2')) { checkAllMagazineBtns(); backPackWindow.classList.add('show') }
})

// On game load
setInitialGoals();
setPlayerSkins();
coinsText.textContent = +localStorage.getItem('coins');
coinsText.classList.add('show');
if(localStorage.getItem('musics') === 'buy') musProgress.classList.add('show');
if(localStorage.getItem('activeCursor')) document.body.classList.add(localStorage.getItem('activeCursor'));
if(localStorage.getItem('dblCoins') === 'buy') plusCoinsInfo.classList.add('dbl-active-text');
if(document.body.clientWidth < 550) {
  sendAnswerBtn.textContent = 'Надіслати';
  btnOpenHelpWindow.textContent = 'Підказки по прикладам';
  openTextArea.textContent = 'Вікно для считання';
  inputAnswer.setAttribute('placeholder', 'Введіть відповідь...');
};