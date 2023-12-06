document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    let circlePosition = { x: 0, y: 0 };
  
    // Create the game grid
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.row = row;
        cell.dataset.col = col;
        gameContainer.appendChild(cell);
      }
    }
  
    // Define the labyrinth walls (you can customize this)
    const labyrinthWalls = [
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 1, y: 3 },
      { x: 3, y: 1 },
      { x: 3, y: 2 },
      { x: 3, y: 3 },
      { x: 4, y: 3 },
      { x: 5, y: 3 },
      { x: 5, y: 4 },
      { x: 5, y: 5 },
      { x: 6, y: 5 },
      { x: 7, y: 5 },
      { x: 7, y: 6 },
      { x: 7, y: 7 },
      { x: 7, y: 8 },
    ];
  
    // Add walls to the specified positions
    labyrinthWalls.forEach((wall) => {
      const wallCell = document.querySelector(`.cell[data-row="${wall.y}"][data-col="${wall.x}"]`);
      wallCell.classList.add('wall');
    });
  
    // Add the circle to the initial position
    const initialCell = document.querySelector(`.cell[data-row="${circlePosition.y}"][data-col="${circlePosition.x}"]`);
    initialCell.classList.add('circle');
  
    // Handle arrow key presses
    document.addEventListener('keydown', (e) => {
      let newPosition = { ...circlePosition };
  
      switch (e.key) {
        case 'ArrowUp':
          newPosition.y = Math.max(0, newPosition.y - 1);
          break;
        case 'ArrowDown':
          newPosition.y = Math.min(9, newPosition.y + 1);
          break;
        case 'ArrowLeft':
          newPosition.x = Math.max(0, newPosition.x - 1);
          break;
        case 'ArrowRight':
          newPosition.x = Math.min(9, newPosition.x + 1);
          break;
      }
  
      const currentCell = document.querySelector(`.cell[data-row="${circlePosition.y}"][data-col="${circlePosition.x}"]`);
      const newCell = document.querySelector(`.cell[data-row="${newPosition.y}"][data-col="${newPosition.x}"]`);
  
      // Check for collision with walls
      if (!newCell.classList.contains('wall')) {
        // Move the circle to the new position
        currentCell.classList.remove('circle');
        // currentCell.classList.replace('circle', '');
        newCell.classList.add('circle');
        circlePosition = newPosition;
  
        // Check for reaching the exit (you can modify this condition based on your exit location)
        if (newPosition.x === 9 && newPosition.y === 9) {
          alert('Congratulations! You reached the exit.');
        }
      } else {
        // Collision with a wall
        alert('Oops! You hit a wall. Try again.');
      }
    });
  });
  