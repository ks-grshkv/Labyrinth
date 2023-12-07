let circlePosition = { x: 0, y: 0 };
const LAB_SIZE = 10;
const DIALOGUES = {
    'wall': ['hey', 'watcha doin'],
    'edge': ['Careful! You dont want to fall off, dou you?', '...'],
    'stubborn_stone': ['Dont try to break the wall. First youve got to realize something. There is no wall.'],
    'creature': ['woof']
}
let MINVAL = 0
let MAXVAL = LAB_SIZE - 1
let newCell;


document.addEventListener('DOMContentLoaded', () => {

    let circle
    const step = 30;
    level_two_switch = false
    let labyrinthWalls = []

    function moveCircle2(direction) {
        const currentLeft = parseInt(circle.style.left) || 0;
        const currentTop = parseInt(circle.style.top) || 0;
        const exit = document.querySelector('.exit')
        const exit_pos = exit.getBoundingClientRect();

        switch (direction) {
            case "ArrowUp":
                circle.style.top = currentTop - step + "px";
                break;
            case "ArrowDown":
                circle.style.top = currentTop + step + "px";
                break;
            case "ArrowLeft":
                circle.style.left = currentLeft - step + "px";
                break;
            case "ArrowRight":
                circle.style.left = currentLeft + step + "px";
                break;
            default:
                break;
        }
        const charStyle = getComputedStyle(circle);

        if (Math.abs(parseInt(charStyle.left) - exit_pos.x) <= 10 && Math.abs(parseInt(charStyle.top) - exit_pos.y) <= 10) {
            level_two_switch = false
            circlePosition = { x: 1, y: 1 }
            newPosition = { x: 1, y: 1 }
            newCell = document.querySelector(`.cell[data-row="${1}"][data-col="${1}"]`);
            nextLevel()
            document.body.removeChild(circle)
        }
    }



    let INTERRACTIONS_ON = true
    let currentLevel = 1;
    let current_interaction = ''
    let current_interaction_index = 0


    function initializeLevel(x) {
        currentLevel = x

        INTERRACTIONS_ON = true

        const gameContainer = document.getElementById('game-container');
        gameContainer.innerHTML = '';



        circlePosition = { x: 1, y: 1 };

        // grid
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
                break;
            case 3:
                // labyrinthWalls = []
                labyrinthWalls = borders
        }


        labyrinthWalls.forEach((wall) => {

            const wallCell = document.querySelector(`.cell[data-row="${wall.y}"][data-col="${wall.x}"]`);
            wallCell.classList.add('wall');
        });

        const exit = document.querySelector(`.cell[data-row="${LAB_SIZE - 2}"][data-col="${LAB_SIZE - 2}"]`);
        exit.classList.add('exit');


        // Add the circle to the initial position
        const initialCell = document.querySelector(`.cell[data-row="${circlePosition.y}"][data-col="${circlePosition.x}"]`);
        initialCell.classList.add('circle');

        // For now, let's just add a message to indicate the level
        const levelMessage = document.createElement('div');
        levelMessage.textContent = `Level ${currentLevel}`;
        gameContainer.appendChild(levelMessage);

    }

    function nextLevel() {
        if (currentLevel == 4) {
            endGame()
        }
        else {
            alert('Congratulations! You reached the exit.');
            currentLevel++;
            initializeLevel(currentLevel);
        }

    }

    function endGame() {
        alert('The end!')
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
            alert(speech_array[current_interaction_index])
        }

    }

    function defalultInteraction() {
        alert('...')
    }

    function checkWinCondition(newPosition, newCell, currentCell) {
        if (currentLevel != 2) {
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
            INTERRACTIONS_ON = false
        }
        if (newPosition.x === 8 && newPosition.y === 7) {
            INTERRACTIONS_ON = false
            wallCell.classList.remove('wall');
            alert('dissolving')
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


    document.addEventListener('keydown', (e) => {
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
        }
    });

    initializeLevel(1);
});

