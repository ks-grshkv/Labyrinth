let circlePosition = { x: 0, y: 0 };
const LAB_SIZE = 10;
const DIALOGUES = {
    'wall': ['hey', 'watcha doin'],
    'edge': ['oops', 'careful'],
    'creature': ['']
}

document.addEventListener('DOMContentLoaded', () => {
    let currentLevel = 1;
    let current_interaction = ''
    let current_interaction_index = 0
  
    function initializeLevel() {
      // Your level initialization logic here
      // Create the game grid, set up walls, and place the circle in the initial position
  
      // For demonstration purposes, let's assume a simple structure
      const gameContainer = document.getElementById('game-container');
      gameContainer.innerHTML = ''; // Clear the previous level
  
      // You can call a function to set up the walls, initialize the circle, etc.
      // ...
      circlePosition = { x: 1, y: 1 };
  
    // Create the game grid
    for (let row = 0; row < LAB_SIZE; row++) {
      for (let col = 0; col < LAB_SIZE; col++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.row = row;
        cell.dataset.col = col;
        gameContainer.appendChild(cell);
      }
    }
  
    // Define the labyrinth walls (you can customize this)
    const labyrinthWalls = [

      { x: 1, y: 3 },
      { x: 1, y: 3 },
      { x: 1, y: 7 },
      { x: 2, y: 7 },
      { x: 2, y: 5},
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
    const borders = []
    let i = 0
    for (let j = 0; j < LAB_SIZE-1; j++) {
      borders.push({x: i, y: j})
    }
    for (let j = 0; j < LAB_SIZE-1; j++) {
        borders.push({x: j, y: i})
      }
    i = LAB_SIZE-1
    for (let j = 0; j < LAB_SIZE-1; j++) {
        borders.push({x: i, y: j})
      }
    for (let j = 0; j <= LAB_SIZE-1; j++) {
          borders.push({x: j, y: i})
        }
    
    

    labyrinthWalls.push(...borders)
    console.log(labyrinthWalls)
  
    // Add walls to the specified positions
    labyrinthWalls.forEach((wall) => {
        // console.log('aA', wall.y)
      const wallCell = document.querySelector(`.cell[data-row="${wall.y}"][data-col="${wall.x}"]`);
    //   if (wall.x == 0 && wall.y == 0 ) {
        
    //   }
    //     else {wallCell.classList.add('wall');}
    wallCell.classList.add('wall');
    });

    const exit = document.querySelector(`.cell[data-row="${LAB_SIZE-2}"][data-col="${LAB_SIZE-2}"]`);
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
            initializeLevel();
        }
      
    }

    function endGame() {
        alert('The end!')
    }

    function startDialogue(obj) {
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
        if (!newCell.classList.contains('wall')) {
            // Move the circle to the new position
            currentCell.classList.remove('circle');
            // currentCell.classList.replace('circle', '');
            newCell.classList.add('circle');
            circlePosition = newPosition;
      
            // Check for reaching the exit (you can modify this condition based on your exit location)
            if (newPosition.x === LAB_SIZE-2 && newPosition.y === LAB_SIZE-2) {
              nextLevel();
            }
          } else {
            startDialogue('wall')
          }
          
    }

    function levelOneTricks(newPosition) {
        if (newPosition.x === 8 && newPosition.y === 4) {
            const wallCell = document.querySelector(`.cell[data-row="${7}"][data-col="${8}"]`);
            wallCell.classList.add('wall');
        }
    }


  
    // Your existing code for handling arrow key presses
    document.addEventListener('keydown', (e) => {
        let newPosition = { ...circlePosition };
  
        switch (e.key) {
          case 'ArrowUp':
            if (newPosition.y === 0) {startDialogue('edge')}
            newPosition.y = Math.max(0, newPosition.y - 1);
            break;
          case 'ArrowDown':
            if (newPosition.y === LAB_SIZE-1) {startDialogue('edge')}
            newPosition.y = Math.min(LAB_SIZE-1, newPosition.y + 1);
            break;
          case 'ArrowLeft':
            if (newPosition.x === 0) {startDialogue('edge')}
            newPosition.x = Math.max(0, newPosition.x - 1);
            break;
          case 'ArrowRight':
            if (newPosition.x === LAB_SIZE-1) {startDialogue('edge')}
            newPosition.x = Math.min(LAB_SIZE-1, newPosition.x + 1);
            break;
        }
    
        const currentCell = document.querySelector(`.cell[data-row="${circlePosition.y}"][data-col="${circlePosition.x}"]`);
        const newCell = document.querySelector(`.cell[data-row="${newPosition.y}"][data-col="${newPosition.x}"]`);
        checkWinCondition(newPosition, newCell, currentCell);
        switch (currentLevel) {
            case 1: levelOneTricks(newPosition)
        }
    });
  
    // Initialize the first level
    initializeLevel();
  });
  
