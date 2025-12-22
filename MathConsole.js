function consoleRender(txt) {
  consoleTextBlock.appendChild(txt);
  consoleTextBlock.scrollTop = consoleTextBlock.scrollHeight;
  if(commHistory[commHistory.length - 1] !== consoleInput.value) commHistory.push(consoleInput.value);
  historyIndex = commHistory.length;
  consoleInput.value = '';
  consoleInput.focus();
}

function goCommand(type, item, otherVal) {
  const txt = document.createElement('pre');

  if (aliasesComm[type]) {
  const fullCommand = aliasesComm[type] + (item ? ' ' + item : '');
  const [realType, realItem] = fullCommand.split(' ');

  return goCommandObj[realType]( realItem || '', '', txt
  );
  }

  if(goCommandObj[type]) goCommandObj[type](item || '', otherVal || '', txt);
  else { txt.textContent = `Не вдалось знайти команду: ${type}`; txt.classList.add('wrong-text'); consoleRender(txt); }
}

const goCommandObj = {
  '/alias': (item, otherVal, txt) => {
    const [setComType, setComItem] = otherVal.split(' ').map(v => v.trim());
    if(!allClassicCommands.includes(setComType) || setComType === '/alias') { txt.textContent = `Команда не знайдена або заборонена\n(Провірте будь ласка написання команди)\n(заборонено використовувати зайняті назви для команд)`; txt.classList.add('wrong-text') }
    else {
      aliasesComm[item] = setComType + (setComItem ? ' ' + setComItem : '');
      allCommands.push(item);
      localStorage.setItem('alias-command', JSON.stringify(aliasesComm))
      txt.textContent = `Успішно добавлено alias ${item} яка робить:\n${setComType} ${setComItem ? setComItem : ''}`;
      txt.classList.add('correct-text');
    }
    consoleRender(txt);
  },
  '/del-alias': (item, otherVal, txt) => {
    if(!aliasesComm[item]) { txt.textContent = `alias за назвою "${item}" не знайдено`; txt.classList.add('wrong-text') }
    else {
      delete aliasesComm[item];
      localStorage.setItem('alias-command', JSON.stringify(aliasesComm));
      txt.textContent = `Успішно видалено alias за ключем ${item}`;
      txt.classList.add('correct-text');
    }
    consoleRender(txt);
  },
  '/my-alias': (item, otherVal, txt) => {
    if(!Object.keys(aliasesComm).length) { txt.textContent = 'У вас немає жодної alias команди'; return consoleRender(txt); }
    let str = 'ВСІ ВАШІ КОМАНДИ\n';
    for(let i in aliasesComm) str += i + ' => ' + aliasesComm[i] + '\n';
    txt.textContent = str;
    consoleRender(txt);
  },
  '/test-alias': (item, otherVal, txt) => {
    if(!aliasesComm[item]) { txt.textContent = `${item ? 'У вас не знайдено команду по ключу ' + item : 'Ви не вказали ключ до команди'}`; txt.classList.add('wrong-text') }
    else { txt.textContent = `Ваша команда ${item} робить ${aliasesComm[item]}`; txt.classList.add('correct-text') }
    consoleRender(txt);
  },
  '/clear-all-alias': (item, otherVal, txt) => {
    aliasesComm = {};
    localStorage.setItem('alias-command', JSON.stringify("{}"));
    txt.textContent = 'Успішно видалено всі аліас команди!'
    txt.classList.add('correct-text');
    consoleRender(txt);
  },
  '/goals-number': (item, otherVal, txt) => {
    setInitialGoals();
    let passedGoals = 0,
    lockGoals = 0;
    for(let i of allGoalsArray) {
      if(i.classList.contains('passed')) passedGoals++;
      else lockGoals++;
    }
    txt.textContent = `Враховуються всі досягнення окрім відсоткового!\nРозблокованих досягнень: ${passedGoals}\nНе розблокованих досягнень: ${lockGoals}`
    consoleRender(txt);
  },
  '/check-magazine': (item, otherVal, txt) => {
    checkAllMagazineBtns();
    let passedMag = 0,
    lockMag = 0,
    lockMagPrice = 0;

    for(let i of allMagazineBtns) {
      if( localStorage.getItem(i.dataset.id) === 'buy' ) passedMag++;
      else { lockMag++; lockMagPrice += +i.dataset.price; }
    }

    txt.textContent = `\n\nЗ магазину у вас:\nКуплено предметів: ${passedMag}\nЩе не куплено предметів: ${lockMag}\nОбща ціна не куплених предметів: ${lockMagPrice}\n\n`
    consoleRender(txt);
  },
  '/help': (item, otherVal, txt) => { txt.textContent = Object.values(commandSyntaxMap).join('\n'); consoleRender(txt); },
  '/history': (item, otherVal, txt) => {
    if(!commHistory.length) txt.textContent = 'Останнім часом ви не користувались консольними командами'
    else txt.textContent = `Ваша історія: ${commHistory.join('\n')}`
    consoleRender(txt);
  },
  '/clear-history': (item, otherVal, txt) => {
    txt.textContent = 'Ваша історія успішно очищена!';
    txt.classList.add('correct-text');
    commHistory = [];
    consoleRender(txt);
  },
  '/bind-the-button': (item, otherVal, txt) => {
    const [bindType, bindItem] = otherVal.split(' ');
    if(!allCommands.includes(bindType)) {txt.textContent = `'Команди ${bindType} для прив'язки не знайдено`; txt.classList.add('wrong-text')}
    else {
      bindButtons[item] = `${bindType} ${bindItem}`;
      localStorage.setItem('bind-player-buttons', JSON.stringify(bindButtons))
      txt.textContent = `Ваша кнопка '${item}' успішно прив'язана до команди '${bindType} ${bindItem}'`;
      txt.classList.add('correct-text');
    }
    consoleRender(txt);
  },
  '/my-buttons': (item, otherVal, txt) => {
    txt.textContent = 'Ваші кнопки:\n';
    for(let i in bindButtons) txt.textContent += `${i} => ${bindButtons[i]}\n`;
    consoleRender(txt);
  },
  '/del-button': (item, otherVal, txt) => {
    if(!bindButtons[item]) { txt.textContent = `Кнопки по ключу ${item} не знайдено`; txt.classList.add('wrong-text'); }
    else {
      txt.textContent = `Успішно видалено кнопку ${item} яка робила ${bindButtons[item]}`;
      txt.classList.add('correct-text');
      delete bindButtons[item];
      localStorage.setItem('bind-player-buttons', JSON.stringify(bindButtons))
    }
    consoleRender(txt);
  },
  '/test-button': (item, otherVal, txt) => {
    if(!bindButtons[item]) { txt.textContent = `Кнопки '${item}' не знайдено`; txt.classList.add('wrong-text') }
    else {
      txt.textContent = `Ваша кнопка ${item} робить ${bindButtons[item]}`;
      txt.classList.add('correct-text');
    }
    consoleRender(txt);
  },
  '/clear-all-buttons': (item, otherVal, txt) => {
    bindButtons = {};
    localStorage.setItem('bind-player-buttons', JSON.stringify("{}"))
    txt.textContent = 'Всі ваші кнопки видалено';
    txt.classList.add('correct-text');
    consoleRender(txt);
  },
  '/reset-settings': (item, otherVal, txt) => {
    goCommand('/skin', 'def');
    goCommand('gold-border', 'off');
  },
  '/show-my-config': (item, otherVal, txt) => {
    txt.textContent = `Скін: ${document.documentElement.classList[0] || 'Нічого'}\nЗолота рамка: ${localStorage.getItem('gold-border') === 'true' ? 'on' : 'off'}
Пісня: ${Object.keys(allAudiosObj).find(v => currentAudio === allAudiosObj[v]) || 'У вас не грає пісня'}\nАктивний цикл пісні: ${currentAudio?.loop ? 'Music loop' : getRandomMusic ? 'Music random-loop' : 'Нічого'}
Аліасів: ${Object.keys(aliasesComm).length}\nПідключених кнопок: ${Object.keys(bindButtons).length}\nАктивна гра: ${!mathGameContent.classList.contains('show') ? 'Ви зараз не граєте' : playDiff}`;
    consoleRender(txt);
  },
  '/skin': (item, otherVal, txt) => {
    if(item === 'def') {
      document.documentElement.classList.remove(localStorage.getItem('activeSkin'));
      localStorage.removeItem('activeSkin')
      txt.textContent = 'Скін обнулено';
      txt.classList.add('correct-text');
      return consoleRender(txt);
    }
    const str = 'math-' + item.toLowerCase()
    const noMagSkinBlock = allSkinsBtns.find(v => v.dataset.skin === str)?.parentElement;
    const noMagSkinUnlock = noMagSkinBlock ? noMagSkinBlock.classList.contains('passed') || noMagSkinBlock.classList.contains('active') : false;
    if(localStorage.getItem(str) !== 'buy' && !noMagSkinUnlock) {
      txt.textContent = 'У вас не відкритий цей скін!';
      txt.classList.add('wrong-text');
      return consoleRender(txt);
    }
    document.documentElement.classList.remove(localStorage.getItem('activeSkin'))
    localStorage.setItem('activeSkin', str)
    document.documentElement.classList.add(str)
    txt.textContent = 'Успішно змінено тему!';
    txt.classList.add('correct-text');
    consoleRender(txt);
  },
  '/all-skins-and-items': (item, otherVal, txt) => {
    txt.textContent = `Всі скіни та предмети:\n${allSkinAndItemsName.join('\n')}`;
    consoleRender(txt);
  },
  '/unlocked-skins-and-items': (item, otherVal, txt) => {
    setPlayerSkins();
    checkAllMagazineBtns();
    txt.textContent = `Всі розблоковані скіни та предмети:
${allSkinsBlocks.filter(v => v.classList.contains('passed') || v.classList.contains('active')).map(v => v.lastElementChild.dataset.skin.replace('math-','')).join('\n')}
${allMagazineBtns.filter(v => localStorage.getItem(v.dataset.id) === 'buy').map(v => v.dataset.id.replace('math-','')).join('\n')}`;
    consoleRender(txt);
  },
  '/clear-console': (item, otherVal, txt) => {
    consoleTextBlock.textContent = '';
    consoleInput.value = '';
    consoleInput.focus();
  },
  '/gold-border': (item, otherVal, txt) => {
    if(localStorage.getItem('gold-border-active') !== 'buy') {
      txt.textContent = 'У вас не відкритий цей ексклюзивний елемент!';
      txt.classList.add('wrong-text');
      return consoleRender(txt);
    };
    const op = item === 'on' ? true : item === 'off' ? false : 'noCorr';
    if(op === 'noCorr') {txt.textContent = 'Не коректний запис команди!'; txt.classList.add('wrong-text'); return consoleRender(txt);};
    if(op === true) {
      document.body.classList.add('gold-border-active');
      localStorage.setItem('gold-border', true);
      txt.textContent = 'Ввімкнено золоту рамку!';
    }
    else {
      document.body.classList.remove('gold-border-active');
      localStorage.setItem('gold-border', false);
      txt.textContent = 'Вимкнуто золоту рамку!'
    }
    txt.classList.add('correct-text');
    consoleRender(txt);
  },
  '/toggle-gold-border': (item, otherVal, txt) => {
    const initialBorder = localStorage.getItem('gold-border') === 'true';
    localStorage.setItem('gold-border', !initialBorder);
    document.body.classList.toggle('gold-border-active');
    txt.textContent = 'Успішно змінено статус золотої рамки';
    txt.classList.add('correct-text');
    consoleRender(txt);
  },
  '/music': (item, otherVal, txt) => {
    if(localStorage.getItem('musics') !== 'buy') {txt.textContent = 'У вас не доступні пісні, купіть їх в магазині щоб користуватись!'; txt.classList.add('wrong-text'); return consoleRender(txt);};

    if(item === 'random') {
      if(currentAudio) {
        currentAudio.pause();
        currentAudio.loop = false;
        musicLoopText.style.display = 'none';
        musicRandomLoopText.style.display = 'none';
        getRandomMusic = false;
        currentAudio.removeEventListener('timeupdate', updateProgress);
      };
      musicPlayText.style.display = 'block';
      currentAudio = allAudiosArr[Math.floor(Math.random() * allAudiosArr.length)];
      currentAudio.addEventListener('timeupdate', updateProgress);
      currentAudio.currentTime = 0;
      currentAudio.play();

      txt.textContent = `Успішно запустили рандом пісню (${currentAudio.classList[0]})`;
      txt.classList.add('correct-text');
      return consoleRender(txt);
    }
    else if(item === 'repeat') {
      if(!currentAudio) { txt.textContent = 'У вас останнім часом не грала жодна пісня'; txt.classList.add('wrong-text') }
      else if(currentAudio.loop === true) { txt.textContent = 'У вас стоїть пісня на повторі !' }
      else if(getRandomMusic) { txt.textContent = 'У вас зараз працює loop-random'; txt.classList.add('wrong-text') }
      else if(currentAudio) {
        currentAudio.currentTime = 0;
        currentAudio.play();
        txt.textContent = 'Успішно повторено пісню';
        txt.classList.add('correct-text');
        musicPlayText.style.display = 'block';
      }
      return consoleRender(txt);
    }
    else if(item === 'loop') {
      if(!currentAudio) {txt.textContent = 'У вас не грає жодної пісні'; txt.classList.add('wrong-text')}
      else if(getRandomMusic) { txt.textContent = 'У вас зараз працює loop-random'; txt.classList.add('wrong-text') }
      else if(!currentAudio.paused) {
        currentAudio.loop = true;
        musicLoopText.style.display = 'block';
        musicPlayText.style.display = 'block';
        txt.textContent = 'Успішно включено повтор пісні';
        txt.classList.add('correct-text');
      }
      else { txt.textContent = 'У вас не грає пісні для ставки на авто-повтор'; txt.classList.add('correct-text') }
      return consoleRender(txt);
    }
    else if(item === 'un-loop') {
      if(!currentAudio) { txt.textContent = 'У вас не грає жодної пісні'; txt.classList.add('wrong-text') }
      else { currentAudio.loop = false; musicLoopText.style.display = 'none'; txt.textContent = 'Успішно виключено авто повтор пісні'; txt.classList.add('correct-text') }
      return consoleRender(txt);
    }
    else if(item === 'loop-random') {
      if(currentAudio && currentAudio.loop) { txt.textContent = 'У вас зараз працює loop'; txt.classList.add('wrong-text') }
      else if(!currentAudio || currentAudio.paused) { txt.textContent = 'У вас не запущено жодної пісні\nСпочатку запустіть якусь пісню'; txt.classList.add('wrong-text') }
      else {
        getRandomMusic = true;
        musicRandomLoopText.style.display = 'block';
        txt.textContent = 'Успішно включено loop-random';
        txt.classList.add('correct-text');
      }
      return consoleRender(txt);
    }
    else if(item === 'un-loop-random') {
      if(!getRandomMusic) { txt.textContent = 'У вас уже виключена функція loop-random'; txt.classList.add('wrong-text') }
      else { getRandomMusic = false; musicRandomLoopText.style.display = 'none'; txt.textContent = 'Успішно виключено loop-random'; txt.classList.add('correct-text') }
      return consoleRender(txt);
    }

    if(!allAudiosObj[item]) {txt.textContent = `Пісня "${item}" не знайдена`; txt.classList.add('wrong-text'); return consoleRender(txt);}
    if(currentAudio) {
      currentAudio.pause();
      currentAudio.loop = false;
      musicLoopText.style.display = 'none';
      musicRandomLoopText.style.display = 'none';
      currentAudio.removeEventListener('timeupdate', updateProgress)
    };

    currentAudio = allAudiosObj[item];
    currentAudio.addEventListener('timeupdate', updateProgress)
    currentAudio.currentTime = 0;
    currentAudio.play()

    musicPlayText.style.display = 'block';

    txt.textContent = `Успішно запустили пісню ${item}`
    txt.classList.add('correct-text')
    consoleRender(txt);
  },
  '/music-list': (item, otherVal, txt) => {
    txt.textContent = 'Всі доступні пісні:\n';
    for(let i in allAudiosObj) txt.textContent += `${i}\n`;
    consoleRender(txt);
  },
  '/initial-music-info': (item, otherVal, txt) => {
    if(!currentAudio) { txt.textContent = 'У вас не грає жодної пісні'; txt.classList.add('wrong-text'); }
    else {
      txt.textContent = `\n\nІнформація поточної пісні:\nНазва пісні: ${Object.keys(allAudiosObj).find(v => allAudiosObj[v] === currentAudio)}
Її довжина:${musicTimeProgress.textContent.split('/')[1]}
Ви прослухали: ${musicTimeProgress.textContent.split('/')[0]}\n\n`
      txt.classList.add('correct-text');
    }
    consoleRender(txt);
  },
  '/s-music': (item, otherVal, txt) => {
    if(currentAudio) {
      currentAudio.loop = false;
      musicLoopText.style.display = 'none';
      musicPlayText.style.display = 'none';
      musicTimeProgress.textContent = '';
      getRandomMusic = false;
      musicRandomLoopText.style.display = 'none';
      currentAudio.removeEventListener('timeupdate', updateProgress)
      musProgress.value = 0
      currentAudio.pause()
      currentAudio = null;

      txt.textContent = 'Пісня зупинена\n'
      txt.classList.add('correct-text')
    }
    else {txt.textContent = 'У вас не грає жодної пісні'; txt.classList.add('wrong-text')}
    consoleRender(txt);
  },
  '/all-saported-music-arguments': (item, otherVal, txt) => {
    txt.textContent = `Доп функції для музики(/music) є:\nloop => ставить поточну музику на постійний повтор
loop-random => буде рандомно прокручувати пісні\nrandom => один раз включе рандом пісню\nДля loop-random та loop щоб виключити їх
просто в початку допишіть un-
repeat => повторяє поточну пісню`;
    consoleRender(txt);
  },
  '/game': (item, otherVal, txt) => {
    if(item === 'easy') {btnStartEasyGame.click(); txt.textContent = `Гра ${item} успішно запущена`; txt.classList.add('correct-text')}
    else if(item === 'medium') {btnStartMediumGame.click(); txt.textContent = `Гра ${item} успішно запущена`; txt.classList.add('correct-text')}
    else if(item === 'hard') {btnStartHardGame.click(); txt.textContent = `Гра ${item} успішно запущена`; txt.classList.add('correct-text')}
    else if(item === 'mega-hard') {btnStartMegaHardGame.click(); txt.textContent = `Гра ${item} успішно запущена`; txt.classList.add('correct-text')}
    else { txt.textContent = `Гра ${item} не знайдена`; txt.classList.add('wrong-text') }
    consoleRender(txt);
  },
  '/daily': (item, otherVal, txt) => {
    if(+localStorage.getItem('last-daily-day') !== +new Date().getDate()) {
      const money = Math.floor(Math.random() * (200 - 25 + 1) + 25)

      txt.textContent = `Ви получили щоденну нагороду: ${money} монет`;
      txt.classList.add('correct-text');

      localStorage.setItem('coins', +localStorage.getItem('coins') + money);
      coinsText.textContent = localStorage.getItem('coins')
      localStorage.setItem('last-daily-day', new Date().getDate());
    }
    else {txt.textContent = 'Ви сьогодні уже забрали щоденну нагороду!'; txt.classList.add('wrong-text')}
    consoleRender(txt);
  },
  '/clear-all': (item, otherVal, txt) => {
    goCommand('/clear-all-alias');
    goCommand('/clear-all-buttons');
    goCommand('/clear-history');
    goCommand('/reset-settings');
    txt.textContent = 'Все скинуто успішно';
    txt.classList.add('correct-text');
    return consoleRender(txt);
  },
  '/close-all-window': (item, otherVal, txt) => {
    playerGoalsWindow.classList.remove('show');
    selectDifficultWindow.classList.remove('show');
    helpWindow.classList.remove('show');
    statsWindow.classList.remove('show');
    skinWindow.classList.remove('show');
    magazineWindow.classList.remove('show');
    backPackWindow.classList.remove('show');

    if(PS === 0 && badPlayerAnsSer <= 1) {
      localStorage.setItem('play-number', +localStorage.getItem('play-number') - 1);
      localStorage.setItem('bad-answer', +localStorage.getItem('bad-answer') - badPlayerAnsSer);
    }
    mathGameContent.classList.remove('show');
    inputAnswer.classList.remove('show');
    sendAnswerBtn.classList.remove('show');
    btnOkay.classList.remove('show');
    btnOpenHelpWindow.classList.remove('show');
    textAreaFromAnswer.classList.remove('show');

    txt.textContent = 'Все закрито успішно';
    txt.classList.add('correct-text');
    return consoleRender(txt);
  },
  '/stats': (item, otherVal, txt) => { setAllStats(); statsWindow.classList.add('show'); txt.textContent = 'Вікно відкрито успішно!'; consoleRender(txt); },
  '/goals': (item, otherVal, txt) => { setInitialGoals(); playerGoalsWindow.classList.add('show'); txt.textContent = 'Вікно відкрито успішно!'; consoleRender(txt) },
  '/magazine':  (item, otherVal, txt) => { checkAllMagazineBtns(); magazineWindow.classList.add('show'); txt.textContent = 'Вікно відкрито успішно!'; consoleRender(txt) },
  '/back-pack': (item, otherVal, txt) => { checkAllMagazineBtns(); backPackWindow.classList.add('show'); txt.textContent = 'Вікно відкрито успішно!'; consoleRender(txt) },
  '/skins': (item, otherVal, txt) => { skinWindow.classList.add('show'); txt.textContent = 'Вікно відкрито успішно!'; consoleRender(txt) },
  '/cat': (item, otherVal, txt) => { txt.textContent = catsImg[Math.floor(Math.random() * catsImg.length)]; consoleRender(txt) },
  '/echo': (item, otherVal, txt) => {
    txt.textContent = consoleInput.value.replace('/echo ', '').replace(/\{([\w-]+)\}/g, (_, v) => allPlayerConsoleValues[v] ?? `{${v}}`);
    txt.style.color = 'orange';
    txt.style.textShadow = '0 0 5px orange';
    consoleRender(txt);
  },
  '/cursor': (item, otherVal, txt) => {
    if(item === 'def') {
      document.body.classList.remove(localStorage.getItem('activeCursor'));
      localStorage.removeItem('activeCursor');
      txt.textContent = 'Успішно скинуто курсор';
      txt.classList.add('correct-text');
      return consoleRender(txt);
    }
    const str = item + '-cursor';
    if(localStorage.getItem(str) !== 'buy') { txt.textContent = `У вас відсутній курсор ${item}`; txt.classList.add('wrong-text') }
    else {
      document.body.classList.remove(localStorage.getItem('activeCursor'));
      document.body.classList.add(str);
      localStorage.setItem('activeCursor', str);
      txt.textContent = `Успішно використано курсор ${item}`;
      txt.classList.add('correct-text');
    }
    consoleRender(txt);
  },
  '/all-classic-buttons': (item, otherVal, txt) => { txt.textContent = allBtnsInfo; consoleRender(txt); },
  '/set-value': (item, otherVal, txt) => {
    allPlayerConsoleValues[item] = otherVal;
    localStorage.setItem('player-console-values', JSON.stringify(allPlayerConsoleValues))
    txt.textContent = `Ваша змінна "${item} => ${otherVal}" успішно створена
Для перевірки використайте /echo {${item}}
Якщо виникли проблеми то перевірти запис змінної(не може мати пробіли)
Для використання в будь якій команді потрібно писати: {${item}}`;
    txt.classList.add('correct-text');
    consoleRender(txt);
  },
  '/del-value': (item, otherVal, txt) => {
    if(!allPlayerConsoleValues[item]) { txt.textContent = `Змінної за ключем ${item} не знайдено`; txt.classList.add('wrong-text'); }
    else {
      delete allPlayerConsoleValues[item];
      localStorage.setItem('player-console-values', JSON.stringify(allPlayerConsoleValues));
      txt.textContent = `Вашу змінну за ключем ${item} видаленно`;
      txt.classList.add('correct-text');
    }
    consoleRender(txt);
  },
  '/all-console-values': (item, otherVal, txt) => {
    txt.textContent = `Всі ваші змінні:\n${Object.keys(allPlayerConsoleValues).map(v => `${v} => ${allPlayerConsoleValues[v]}`).join('\n')}`;
    consoleRender(txt);
  }
}

const allPlayerConsoleValues = JSON.parse(localStorage.getItem('player-console-values') || "{}")

let aliasesComm = JSON.parse(localStorage.getItem('alias-command') || "{}");
const bindButtons = JSON.parse(localStorage.getItem('bind-player-buttons') || "{}");
const allAudiosObj = {};
const allAudiosArr = [];
document.querySelectorAll('.all-audios-block > audio').forEach(v => {
  const name = v.classList[0];
  allAudiosObj[name] = v;
  allAudiosArr.push(v);
})
const allAudiosNameArr = Object.keys(allAudiosObj);

let currentAudio = null;
let musicTimeProgress = document.querySelector('.music-time');

function updateProgress() {
  if(!currentAudio) return;
  if (!isNaN(currentAudio.duration) && isFinite(currentAudio.duration)) musProgress.max = currentAudio.duration;
  musProgress.value = currentAudio.currentTime;
  const m = Math.floor(currentAudio.currentTime / 60),
  s = Math.floor(currentAudio.currentTime % 60),
  maxM = Math.floor(currentAudio.duration / 60),
  maxS = Math.floor(currentAudio.duration % 60);
  musicTimeProgress.textContent = `${String(m).padStart(2, '0')} : ${String(s).padStart(2, '0')} / ${String(maxM).padStart(2, '0')} : ${String(maxS).padStart(2, '0')}`
}

const allBtnsInfo = `
Всі кнопки для зручного
використання консолі:
ctrl + → ===> Вставляє текст із підказки

\` ===> Відкрити/закрити консоль
↑, ↓ ===> Навігація по командам
Tab ===> Вставити вибрану команду з навігації
(якщо не вибрано то вставиться перша)
Enter ===> відправити команду
`

const commandSyntaxMap = {
'/alias': '/alias <newName> = <command> [arg]',
'/del-alias': '/del-alias <aliasName>',
'/test-alias': '/test-alias <aliasName>',
'/bind-the-button': '/bind-the-button <button> = <command> [arg]',
'/del-button': '/del-button <button>',
'/test-button': '/test-button <button>',
'/skin': '/skin <name|def>',
'/gold-border': '/gold-border <on|off>',
'/toggle-gold-border': '/toggle-gold-border',
'/music': '/music <item>',
'/s-music': '/s-music',
'/music-list': '/music-list',
'/initial-music-info': '/initial-music-info',
'/game': '/game <difficulty>',
'/daily': '/daily',
'/cursor': '/cursor <name|def>',
'/echo': '/echo <text>',
'/help': '/help',
'/clear-console': '/clear-console',
'/history': '/history',
'/clear-history': '/clear-history',
'/reset-settings': '/reset-settings',
'/show-my-config': '/show-my-config',
'/stats': '/stats',
'/goals': '/goals',
'/magazine': '/magazine',
'/back-pack': '/back-pack',
'/skins': '/skins',
'/close-all-window': '/close-all-window',
'/my-alias': '/my-alias',
'/clear-all-alias': '/clear-all-alias',
'/my-buttons': '/my-buttons',
'/clear-all-buttons': '/clear-all-buttons',
'/initial-music-info': '/initial-music-info',
'/goals-number': '/goals-number',
'/cat': '/cat',
'/clear-all': '/clear-all',
'/all-classic-buttons': '/all-classic-buttons',
'/check-magazine': '/check-magazine',
'/set-value': '/set-value <val> = <word>',
'/del-value': '/del-value <val>',
'/all-console-values': '/all-console-values',
'/all-saported-music-arguments': '/all-saported-music-arguments',
'/all-skins-and-items': '/all-skins-and-items',
'/unlocked-skins-and-items': '/unlocked-skins-and-items',
};

const consoleTextBlock = document.querySelector('.console-text-block');

const allClassicCommands = [];
const allCommands = [...Object.keys(aliasesComm)]

let commHistory = [];
let historyIndex = commHistory.length;

const catsImg = [
  "\n\n /\\_/\\ \n( o.o ) \n > ^ < ",
  "\n\n /\\___/\\ \n(  o   o )\n(   =^=  )\n(        )\n(         )\n(          ))))))))",
  "\n\n /\\_/\\  \n( •_• ) \n/ >🍪   Віддай печенько!",
  "\n\n=^._.^=",
  "\n\n  z Z Z\n (=-.-=)  \n  (___)   ",
  "\n\n  /\\_/\\\n ( •ᴥ• )\n / >🍣  "
]

const commandSyntaxText = document.querySelector('.command-syntax-text');
commandSyntaxText.addEventListener('click', () => consoleInput.value = commandSyntaxText.textContent.replace('Аліас команда з синтаксисом ', ''));

const consoleInput = document.querySelector('.console-input');
const openMathConsole = document.querySelector('.open-math-console');
const mathConsoleWindow = document.querySelector('.console-block');
const btnSendCommand = document.querySelector('.send-console-command');

let getRandomMusic = false;

const musicPlayText = document.querySelector('.its-music-play-text');
const musicLoopText = document.querySelector('.its-loop-text');
const musicRandomLoopText = document.querySelector('.its-randomLoop-text');

// Audio ended
allAudiosArr.forEach(v => v.addEventListener('ended', () => {
  if(v !== currentAudio || currentAudio.loop) return;
  else if(getRandomMusic) {
    let mus = null;
    do{ mus = allAudiosArr[Math.floor(Math.random() * allAudiosArr.length)] }
    while(mus === currentAudio);
    if(currentAudio) currentAudio.removeEventListener('timeupdate', updateProgress);
    currentAudio = mus;
    currentAudio.addEventListener('timeupdate', updateProgress)
    currentAudio.play();
    musicPlayText.style.display = 'block';
    musicLoopText.style.display = 'none';

    const a = allAudiosNameArr.find(v => allAudiosObj[v] === currentAudio);
    const p = document.createElement('p');
    p.textContent = `Запущено ${a}`;
    consoleRender(p);
  }
  else musicPlayText.style.display = 'none';
}))

const allGoalsArray = Array.from(document.querySelectorAll('.--all-goals-block > div, .--all-goals-element'));

for(let i in goCommandObj) { allClassicCommands.push(i); allCommands.push(i) }

document.querySelector('.clear-console').addEventListener('click', () => {consoleTextBlock.textContent = ''; consoleInput.focus()})

const allCommandsListElem = document.querySelector('.all-commands-list-element');
let allCommandsListIdx = -1;

document.documentElement.addEventListener('keydown', e => {
  if(e.key === 'ArrowUp' && mathConsoleWindow.classList.contains('show')) {
    e.preventDefault();
    if(allCommandsListElem.style.display === 'block') {
      commandSyntaxText.style.display = 'none';
      if(allCommandsListIdx <= 0) return;
      else {
        allCommandsListIdx--;
        allCommandsListElem.children[allCommandsListIdx].focus();
      }
      const txt = document.activeElement.textContent;
      if(!commandSyntaxMap[txt] && !aliasesComm[txt]) return;

      commandSyntaxText.textContent = commandSyntaxMap[txt] || `Аліас команда з синтаксисом ${ commandSyntaxMap[aliasesComm[txt].split(' ')[0]] }`;
      commandSyntaxText.style.display = 'block';
      return;
    }

    if(historyIndex <= 0) return;
    else historyIndex--;
    consoleInput.value = commHistory[historyIndex];
    return;
  }
  else if(e.key === 'ArrowDown' && mathConsoleWindow.classList.contains('show')) {
    e.preventDefault();
    if(allCommandsListElem.style.display === 'block') {
      commandSyntaxText.style.display = 'none';
      if(allCommandsListIdx >= allCommandsListElem.children.length - 1) return;
      else {
        allCommandsListIdx++;
        allCommandsListElem.children[allCommandsListIdx].focus();
      }
      const txt = document.activeElement.textContent;
      if(!commandSyntaxMap[txt] && !aliasesComm[txt]) return;

      commandSyntaxText.textContent = commandSyntaxMap[txt] || `Аліас команда з синтаксисом ${ commandSyntaxMap[aliasesComm[txt].split(' ')[0]] }`;
      commandSyntaxText.style.display = 'block';
      return;
    }

    if(historyIndex < commHistory.length - 1) {historyIndex++; consoleInput.value = commHistory[historyIndex]}
    else consoleInput.value = ''
    return;
  }
  else if(e.key === 'ArrowRight' && e.ctrlKey && commandSyntaxText.style.display === 'block') {
    e.preventDefault();
    consoleInput.value = commandSyntaxText.textContent.replace('Аліас команда з синтаксисом ', '');
  }

  if(e.code === 'Backquote') {
    e.preventDefault();
    commandSyntaxText.style.display = 'none';
    return openMathConsole.click();
  }

  if(e.code === 'Tab' && allCommandsListElem.style.display === 'block' && allCommandsListElem.children.length) {
    e.preventDefault();
    allCommandsListIdx = -1;
    if(document.activeElement.dataset?.value) {
      commandSyntaxText.style.display = 'none';
      consoleInput.value = document.activeElement.dataset.value;
      return consoleInput.focus();
    }
    consoleInput.focus();
    return consoleInput.value = allCommandsListElem.children[0].dataset.value;
  }

  if(e.code === 'Escape') { e.preventDefault(); return openTextArea.click()}
  if(textAreaFromAnswer.classList.contains('show')) return;
  if(e.key === 'Enter') {
    e.preventDefault();
    if(mathConsoleWindow.classList.contains('show')) {
      const val = document.activeElement.dataset.value;
      if(allCommands.includes(val)) consoleInput.value = val;
      btnSendCommand.click();
      return allCommandsListElem.style.display = 'none'
    };
    if(sendAnswerBtn.classList.contains('show')) sendAnswerBtn.click()
    else if(btnOkay.classList.contains('show')) btnOkay.click()
    return;
  }

  else {
    if(mathConsoleWindow.classList.contains('show') || !bindButtons[e.key]) return;
    e.preventDefault();
    const [type, item] =  bindButtons[e.key].split(' ');
    goCommand(type, item);
  }
})

musProgress.addEventListener('click', e => {
  if(!currentAudio) return;

  const rec = musProgress.getBoundingClientRect();
  const clickX = e.clientX - rec.left;

  const percent = clickX / rec.width;

  currentAudio.currentTime = percent * currentAudio.duration;

  updateProgress();
})

consoleInput.addEventListener('input', e => {
  commandSyntaxText.style.display = 'none';
  if(!consoleInput.value.length) { allCommandsListIdx = -1; return allCommandsListElem.style.display = 'none'};

  const text = e.target.value.replaceAll(' ','').toLowerCase().replaceAll('/','');

  const ItsClassComm = Object.keys(commandSyntaxMap).find(v => v.includes(text)), itsAliasComm = Object.keys(aliasesComm).find(v => v.includes(text))
  if(ItsClassComm || itsAliasComm) {
    commandSyntaxText.textContent = commandSyntaxMap[ItsClassComm] || `Аліас команда з синтаксисом ${ commandSyntaxMap[ aliasesComm[itsAliasComm].split(' ')[0] ] }`;
    commandSyntaxText.style.display = 'block';
  }

  allCommandsListElem.textContent = '';
  allCommandsListElem.style.display = 'block';

  for(let comm of allCommands) {
    if(comm.includes(text)) { addElemToCommList(comm); continue; }

    let ln = 0;
    for(let l of comm) if(text.includes(l)) ln++;

    if(ln === text.length) addElemToCommList(comm);
  }

  if(text.includes('music')) allAudiosNameArr.forEach(v => { if( v.includes(text.replace('music', '').trim()) ) addElemToCommList(`/music ${v}`) });

  if(!allCommandsListElem.children.length) {allCommandsListIdx = -1; return allCommandsListElem.style.display = 'none'};
})

consoleInput.addEventListener('focus', () => document.documentElement.scrollTop = 0)

inputAnswer.addEventListener('focus', () => document.documentElement.scrollTop = 0)

function addElemToCommList(comm) {
  const el = document.createElement('li');
  el.dataset.value = comm;
  el.textContent = comm;
  el.tabIndex = 0;
  if(comm in aliasesComm) el.classList.add('alias-command');
  el.title = commandSyntaxMap[comm] || 'Допоміжна команда';
  allCommandsListElem.appendChild(el)
}

allCommandsListElem.addEventListener('click', e => {
  if(e.target.tagName === 'LI') {
    consoleInput.value = e.target.dataset.value;
    allCommandsListElem.style.display = 'none';
    allCommandsListIdx = -1;
    commandSyntaxText.style.display = 'none';
  }
})

openMathConsole.addEventListener('click', () => {
  mathConsoleWindow.classList.toggle('show');
  consoleInput.value = '';
  if(mathConsoleWindow.classList.contains('show')) consoleInput.focus();
  allCommandsListElem.style.display = 'none';
  allCommandsListIdx = -1;
  commandSyntaxText.style.display = 'none';
})

btnSendCommand.addEventListener('click', () => {
  if(!consoleInput.value.length || consoleInput.value.trim() === '/') return consoleInput.focus();
  const t = consoleInput.value
  .replaceAll('<','').replaceAll('>','').replaceAll('[','').replaceAll(']','')
  .replace(/\{([\w-]+)\}/g, (_, v) => allPlayerConsoleValues[v] ?? `{${v}}`)
  .replaceAll('  ', ' ')
  .trim();

  const [type, item] = t
  .slice(0, t.indexOf('=') === -1 ? t.length : t.indexOf('='))
  .split(' ');

  if((type === '/alias' || type === '/bind-the-button') && !t.includes('=')) return consoleTextBlock.innerHTML += 'У вас не правильно записана команда!';

  let all = null;
  if(t.includes('=')) all = t
  .slice(t.indexOf('=') + 1)
  .trim();

  commandSyntaxText.style.display = 'none';
  goCommand(type, item, all)
})