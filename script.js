let circlePosition = { x: 0, y: 0 };
const LAB_SIZE = 10;
const DIALOGUES = {
    'wall': ['Ouch!', 'Hey there', 'Watcha doin?', 'Dont mind me, Im just a humble wall...', 'You know, I wanted to make a joke about Matrix and non-binarity one day...', 'Honestly, I just fell asleep', 'But I feel like it could be a good one...', 'zzzzz...','*The wall pretends to fall aslep*', '*The wall uses asterisks to make it seem it is not the wall who is talking*'],
    'edge': ['Careful! You dont want to fall off, do you?', 'OK STOP', 'DUDE', 'Am I a joke to you?','Privet ty ohuel?', 'OK do wahtever you want...', '...'],
    'stubborn_stone': ['Man, do not try to break the wall', 'First you need to realize something... ', 'There is no wall.', 'T h e r e  i s  n o  w a l l.'],
    'creature': ['woof']
}
let MINVAL = 0
let MAXVAL = LAB_SIZE - 1
let newCell;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function lightenColor(color, steps, interval) {
    const hexRegex = /^#([0-9A-Fa-f]{3}){1,2}$/;
    if (!hexRegex.test(color)) {
      console.error('Invalid color format. Please provide a valid hexadecimal color.');
      return;
    }
  
    const hex = color.slice(1);
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
  
    const stepSize = 255 / steps;
  
    let currentStep = 0;

    const intervalId = setInterval(() => {
      currentStep++;
  
      const newR = Math.min(255, Math.round(r + currentStep * stepSize));
      const newG = Math.min(255, Math.round(g + currentStep * stepSize));
      const newB = Math.min(255, Math.round(b + currentStep * stepSize));
  
      const newColor = `#${(1 << 24 | newR << 16 | newG << 8 | newB).toString(16).slice(1)}`;
  
      document.body.style.backgroundColor = newColor;
  
      if (currentStep >= steps) {
        clearInterval(intervalId);
      }
    }, interval);
  }

  
document.addEventListener('DOMContentLoaded', () => {

    const fail_alert = document.getElementById('fail_alert')
    const msge = document.getElementById('msg')

    function Dialogue(msg){
        
        msge.textContent = msg
        if (!msg) {
            fail_alert.style.visibility = "hidden"
        }
        else {
            fail_alert.style.visibility = "visible"
        }
    }

    let wallPositions = []
    let circle
    let l_three_counter = 0
    const step = 31;
    let disable_movement = false
    level_two_switch = false
    let labyrinthWalls = []

    function areRectanglesTouching(rect2) {
        const walls = document.querySelectorAll('.wall')
        let wallPositions_new = []
        walls.forEach((wall)=>{
            wallPositions_new.push(wall.getBoundingClientRect())
        })

        flag = false
        for (let rect1 of wallPositions_new) {
            let expr = (
                rect1.x < rect2.x + rect2.width &&
                rect1.x + rect1.width > rect2.x &&
                rect1.y < rect2.y + rect2.height &&
                rect1.y + rect1.height > rect2.y
            );
            if (expr) {
                console.log(rect1)
                console.log(rect2)
                return true
            }
        }
        return false;
    }

    function moveCircle2(direction) {
        const currentLeft = parseInt(circle.style.left) || 0;
        const currentTop = parseInt(circle.style.top) || 0;
        const exit = document.querySelector('.exit')
        const exit_pos = exit.getBoundingClientRect();
        const rect = circle.getBoundingClientRect();

        switch (direction) {
            case "ArrowUp":
                rect.y = currentTop - step
                if (areRectanglesTouching(rect)) {
                    console.log('cant up')
                    circle.style.top = currentTop + "px";
                } else {
                    console.log('up')
                    circle.style.top = currentTop - step + "px";
                }
                break;
            case "ArrowDown":
                rect.y = currentTop + step
                if (areRectanglesTouching(rect)) {
                    console.log('cant down')
                    
                    circle.style.top = currentTop + "px";
                } else {
                    console.log('down')
                    circle.style.top = currentTop + step + "px";
                }
                break;
            case "ArrowLeft":
                rect.x = currentLeft - step
                if (areRectanglesTouching(rect)) {
                    console.log('cant left')
                    circle.style.left = currentLeft + "px";
                } else {
                    console.log('left')
                    circle.style.left = currentLeft - step + "px";
                }
                break;
            case "ArrowRight":
                rect.x = currentLeft + step
                if (areRectanglesTouching(rect)) {
                    console.log('cant right')
                    circle.style.left = currentLeft + "px";
                } else {
                    console.log('tighr')
                    circle.style.left = currentLeft + step + "px";
                }
                break;
            default:
                break;
        }
        const charStyle = getComputedStyle(circle);

        if (Math.abs(parseInt(charStyle.left) - exit_pos.x) <= 20 && Math.abs(parseInt(charStyle.top) - exit_pos.y) <= 20) {
            level_two_switch = false
            circlePosition = { x: 1, y: 1 }
            newPosition = { x: 1, y: 1 }
            newCell = document.querySelector(`.cell[data-row="${1}"][data-col="${1}"]`);
            nextLevel()
            document.body.removeChild(circle)
        }
        else {
            startDialogue('edge')
        }
    }



    let INTERRACTIONS_ON = true
    let currentLevel = 1;
    let current_interaction = ''
    let dog_Int
    let current_interaction_index = 0


    function initializeLevel(x) {
        current_interaction_index = 0
        currentLevel = x
        msge.textContent = ''
        l_three_counter = 0
        fail_alert.style.visibility = 'hidden'
        wallPositions = []

        INTERRACTIONS_ON = true

        const gameContainer = document.getElementById('game-container');
        gameContainer.innerHTML = '';



        circlePosition = { x: 1, y: 1 };

        for (let row = 0; row < LAB_SIZE; row++) {
            for (let col = 0; col < LAB_SIZE; col++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = row;
                cell.dataset.col = col;
                gameContainer.appendChild(cell);
            }
        }

        const borders = []
        let i = 0
        for (let j = 0; j < LAB_SIZE - 1; j++) {
            borders.push({ x: i, y: j })
        }
        for (let j = 0; j < LAB_SIZE - 1; j++) {
            borders.push({ x: j, y: i })
        }
        i = LAB_SIZE - 1
        for (let j = 0; j < LAB_SIZE - 1; j++) {
            borders.push({ x: i, y: j })
        }
        for (let j = 0; j <= LAB_SIZE - 1; j++) {
            borders.push({ x: j, y: i })
        }

        switch (currentLevel) {
            case 1: labyrinthWalls = [

                { x: 1, y: 3 },
                { x: 1, y: 3 },
                { x: 1, y: 7 },
                { x: 2, y: 7 },
                { x: 2, y: 5 },
                { x: 2, y: 8 },
                { x: 3, y: 1 },

                { x: 3, y: 2 },
                { x: 3, y: 3 },
                { x: 3, y: 4 },
                { x: 3, y: 5 },

                { x: 4, y: 6 },
                { x: 4, y: 7 },

                { x: 5, y: 3 },
                { x: 5, y: 2 },
                { x: 5, y: 4 },
                { x: 5, y: 7 },

                { x: 6, y: 4 },
                { x: 6, y: 5 },
                { x: 7, y: 1 },
                { x: 7, y: 2 },
                { x: 7, y: 5 },
                { x: 7, y: 6 },
                { x: 7, y: 7 },
                { x: 7, y: 8 },
            ];
                labyrinthWalls.push(...borders)
                break;
            case 2: labyrinthWalls = [

                { x: 1, y: 3 },
                { x: 1, y: 2 },

                { x: 2, y: 3 },
                { x: 2, y: 2 },
                { x: 2, y: 1 },
                { x: 1, y: 3 },
                { x: 1, y: 7 },
                { x: 2, y: 7 },
                { x: 2, y: 5 },
                { x: 3, y: 1 },

                { x: 3, y: 2 },
                { x: 3, y: 3 },
                { x: 3, y: 4 },
                { x: 3, y: 5 },

                { x: 5, y: 3 },
                { x: 5, y: 2 },
                { x: 5, y: 4 },

                { x: 6, y: 5 },
                { x: 7, y: 5 },
                { x: 7, y: 6 },
                { x: 7, y: 7 },
                { x: 7, y: 8 },

            ];
                labyrinthWalls.push(...borders)
                labyrinthWalls = labyrinthWalls.filter((item) =>
                    item.x != 0 || item.y != 0
                )
                labyrinthWalls = labyrinthWalls.filter((item) =>
                    item.x != 0 || item.y != 1
                )
                labyrinthWalls = labyrinthWalls.filter((item) =>
                    item.x != 1 || item.y != 0
                )
                labyrinthWalls = labyrinthWalls.filter((item) =>
                    item.x != LAB_SIZE - 2 || item.y != LAB_SIZE - 1
                )
                DIALOGUES['wall']=['Huh?', 'What do you mean there is no wall?', 'I am afraid, I am very much real', 'Nah mate, sorry..']
                break;
            case 3:
                DIALOGUES['wall']=['Hi again!', 'I feel a presence of some sort...', 'Dont you?']
                labyrinthWalls = borders
                break;
            case 4: labyrinthWalls = [];
            DIALOGUES['edge']=['Falling off the plane of existence with a dog is strictly prohibited!','No falling off the plane of existence with a dog please!', 'Seriously, dogs are bad at space-time travel...']
            const dogCell = document.querySelector(`.cell[data-row="${0}"][data-col="${0}"]`);
            dogCell.classList.add('dog')
                break;
        }


        labyrinthWalls.forEach((wall) => {

            const wallCell = document.querySelector(`.cell[data-row="${wall.y}"][data-col="${wall.x}"]`);
            wallCell.classList.add('wall');
            const wall_pos = wallCell.getBoundingClientRect();
            wallPositions.push(wall_pos)
        });

        const exit = document.querySelector(`.cell[data-row="${LAB_SIZE - 2}"][data-col="${LAB_SIZE - 2}"]`);
        exit.classList.add('exit');

        const initialCell = document.querySelector(`.cell[data-row="${circlePosition.y}"][data-col="${circlePosition.x}"]`);
        initialCell.classList.add('circle');

        const levelMessage = document.createElement('div');
        levelMessage.textContent = `Level ${currentLevel}`;
    }

    function nextLevel() {
        if (currentLevel == 4) {
            endGame()
        }
        else {
            
            currentLevel++;
            console.log('initializing level ', currentLevel)
            initializeLevel(currentLevel);
            const prevlevel = currentLevel - 1
            Dialogue('Yay! Level ' + prevlevel + ' complete');
        }

    }

    function endGame() {
        const dog = document.querySelector('.dog')
                dog.classList.remove('dog')
        Dialogue('Вы с собакой успешно прошли игру! С Днём Рождения, Сашa!')
    }

    function startDialogue(obj) {
        if (!INTERRACTIONS_ON) { return }
        const speech_array = DIALOGUES[obj]
        if (obj === current_interaction) {
            current_interaction_index++;
        } else {
            current_interaction = obj;
            current_interaction_index = 0;
        }
        if (current_interaction_index >= speech_array.length) {

            defalultInteraction()
        } else {
            Dialogue(speech_array[current_interaction_index])
        }
        

    }

    function defalultInteraction() {

        Dialogue('...')
        
    }

    function checkWinCondition(newPosition, newCell, currentCell) {
        if (currentLevel != 2) {
            if (!newCell.classList.contains('wall')) {
                currentCell.classList.remove('circle');
                newCell.classList.add('circle');

                circlePosition = newPosition;
                if (newPosition.x === LAB_SIZE - 2 && newPosition.y === LAB_SIZE - 2) {
                    setTimeout(()=>{nextLevel();}, 200)
                    // nextLevel();
                }
            } else {
                startDialogue('wall')
            }
        }
        else {
            try {

                if (!newCell.classList.contains('wall')) {
                    currentCell.classList.remove('circle');
                    newCell.classList.add('circle');
                    circlePosition = newPosition;
                    if (newPosition.x === LAB_SIZE - 2 && newPosition.y === LAB_SIZE - 2) {
                        nextLevel();
                    }
                } else {
                    startDialogue('wall')
                }
            } catch {
                circlePosition = newPosition;

            }
        }
    }

    function levelOneTricks(newPosition) {
        const wallCell = document.querySelector(`.cell[data-row="${7}"][data-col="${8}"]`);
    
        if (newPosition.x === 8 && newPosition.y === 4) {
            wallCell.classList.add('wall');
        }
        if (newPosition.x === 8 && newPosition.y === 6) {
            startDialogue('stubborn_stone')
            l_three_counter++;
            INTERRACTIONS_ON = false
        }
        if (newPosition.x === 8 && newPosition.y === 7) {
            if (l_three_counter == 3) {

                INTERRACTIONS_ON = false
                
                 Dialogue('Oh nooooo the stone is dissolving... Fuck you, Жан Бодрийяр...')
                 lightenColor('#333333', 10, 200);
                 wallCell.classList.remove('wall');
                 l_three_counter++;

            } else {
                Dialogue(DIALOGUES['stubborn_stone'][l_three_counter])
                INTERRACTIONS_ON = false
                l_three_counter++;
            }
        }

    }

    function levelTwoTricks(newPosition) {
        const circlediv = document.querySelector('.circle')
        const charStyle = getComputedStyle(circlediv);
        // circlediv.setAttribute('position', 'absolute')
        circlediv.classList.remove('circle')
        const initial_pos = circlediv.getBoundingClientRect();

        level_two_switch = true
        circle = document.createElement('div')
        circle.classList.add("circle2");
        document.body.appendChild(circle)


        circle.style.left = initial_pos.x + 'px'
        circle.style.top = initial_pos.y + 'px'
    }


    function levelThreeTricks(newPosition) {
        const exit = document.querySelector('.exit')
        if (l_three_counter < 11) {

            exit.classList.remove('exit')
            const new_exit = document.querySelector(`.cell[data-row="${getRandomInt(1, 9)}"][data-col="${getRandomInt(1, 9)}"]`);
            new_exit.classList.add('exit')
            l_three_counter++;
        } else {
            exit.classList.remove('exit')
            exit.classList.add('dog')
            disable_movement = true
            Dialogue('You acquired a new friend! Feels like a win, even if there is no exit now...')
            setTimeout(()=>{
                dog_Int = setInterval(() => {
                    const dog = document.querySelector('.dog')
                    dog.classList.remove('dog')
                    const new_dog = document.querySelector(`.cell[data-row="${getRandomInt(1, 9)}"][data-col="${getRandomInt(1, 9)}"]`);
                    new_dog.classList.add('dog')
                }, 500)
            }, 1000)
            
            setTimeout(()=>{
                clearInterval(dog_Int);
                disable_movement = false;
                nextLevel();
            }, 8000)

        }
    }

    function levelFourTricks(newPosition){
        
        try {
            const dog = document.querySelector('.dog')
            dog.classList.remove('dog')
            const dogCell = document.querySelector(`.cell[data-row="${newPosition.y-1}"][data-col="${newPosition.x-1}"]`);
            dogCell.classList.add('dog')
        }
        catch {
            const dogCell = document.querySelector(`.cell[data-row="${newPosition.y-1}"][data-col="${newPosition.x-1}"]`);
         dogCell.classList.add('dog')
        }
        
    }

    document.addEventListener('keydown', (e) => {
        if (disable_movement) { 
            return }
        let newPosition = { ...circlePosition };

        if (level_two_switch) {
            moveCircle2(e.key);
            
        } else {
            switch (e.key) {
                case 'ArrowUp':
                    if (newPosition.y === 0) {
                        startDialogue('edge')
                    }
                    if (newPosition.y < 0 && currentLevel == 2) {
                        levelTwoTricks(newPosition);
                        level_two_switch = true
                    }
                    newPosition.y = currentLevel == 2 ? newPosition.y - 1 : Math.max(MINVAL, newPosition.y - 1)
                    break;
                case 'ArrowDown':
                    if (newPosition.y === LAB_SIZE - 1) { startDialogue('edge') }
                    newPosition.y = Math.min(MAXVAL, newPosition.y + 1);
                    break;
                case 'ArrowLeft':
                    if (newPosition.x === 0) {
                        startDialogue('edge')
                    }
                    if (newPosition.x < 0 && currentLevel == 2) {
                        levelTwoTricks(newPosition);
                        level_two_switch = true
                    }
                    newPosition.x = currentLevel == 2 ? newPosition.x - 1 : Math.max(MINVAL, newPosition.x - 1)
                    break;
                case 'ArrowRight':
                    if (newPosition.x === LAB_SIZE - 1) { startDialogue('edge') }
                    newPosition.x = Math.min(MAXVAL, newPosition.x + 1);
                    break;
            }
        }

        const currentCell = document.querySelector(`.cell[data-row="${circlePosition.y}"][data-col="${circlePosition.x}"]`);
        newCell = document.querySelector(`.cell[data-row="${newPosition.y}"][data-col="${newPosition.x}"]`);
        checkWinCondition(newPosition, newCell, currentCell);

        switch (currentLevel) {
            case 1:
                levelOneTricks(newPosition);
                break;
            case 2:
                break;
            case 3:
                levelThreeTricks(newPosition);
                break;
            case 4:
                
                levelFourTricks(newPosition)
                break;
        }
    });

    initializeLevel(1);
    Dialogue('Welcome to the Totally Normal Labyrinth! Please open it on a laptop or a PC (the game is not smartphone-friendly). Use arrow keys to navigate.')
});

