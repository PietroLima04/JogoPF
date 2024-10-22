const initialStones = [
    { index: 0, x: 50, y: 50, speed: 6, isHidden: false },
    { index: 1, x: 150, y: 100, speed: 6, isHidden: false },
    { index: 2, x: 500, y: 150, speed: 6, isHidden: false },
    { index: 3, x: 200, y: 500, speed: 6, isHidden: false },
    { index: 4, x: 700, y: 700, speed: 6, isHidden: false },
  ];
  
  const createAndRenderStoneElements = (stones) => {
    const gameElement = document.getElementById('game');
    gameElement.innerHTML = '';  // Limpa o container
    stones.map(stone => {
        const stoneElement = document.createElement('div');
        stoneElement.classList.add('stone');
        stoneElement.dataset.index = stone.index;
        if (stone.isHidden) {
            stoneElement.classList.add('hidden');
            stoneElement.style.display = 'none';
        } else {
            stoneElement.style.display = 'block';
            stoneElement.style.left = `${stone.x}px`;
            stoneElement.style.top = `${stone.y}px`;
        }
        gameElement.appendChild(stoneElement);
    });
  };
  
  const moveStones = (stone, centerX, centerY) => {
    const distanceX = centerX - stone.x;
    const distanceY = centerY - stone.y;
    const direction = Math.atan2(distanceY, distanceX);
    return {
        ...stone,
        x: stone.x + Math.cos(direction) * stone.speed,
        y: stone.y + Math.sin(direction) * stone.speed
    };
  };
  
  const updateStones = (stones, container) => {
    const centerX = container.offsetWidth / 2;
    const centerY = container.offsetHeight / 2;
    return stones.map((stone) => moveStones(stone, centerX, centerY));
  };
  
  const checkCollision = (player, stoneElement) => {
    const playerRect = player.getBoundingClientRect();
    const stoneRect = stoneElement.getBoundingClientRect();
    return !(playerRect.right < stoneRect.left || 
             playerRect.left > stoneRect.right || 
             playerRect.bottom < stoneRect.top || 
             playerRect.top > stoneRect.bottom);
  };
  
  const checkWinCondition = (stones) => stones.every(stone => stone.isHidden);
  
  const handleClick = (event, stones) => {
    return stones.map(stone => {
        const stoneElement = document.querySelector(`.stone[data-index="${stone.index}"]`);
        const rect = stoneElement.getBoundingClientRect();
        const isClicked = event.clientX >= rect.left && event.clientX <= rect.right &&
                          event.clientY >= rect.top && event.clientY <= rect.bottom;
        return isClicked ? { ...stone, isHidden: true } : stone;
    });
  };
  
  const returnMenu = () => {
    window.location.href = 'index.html';
  };
  
  const gameLoop = (stones) => {
    const player = document.getElementById('player');
    const updatedStones = updateStones(stones, document.getElementById('game'));
    createAndRenderStoneElements(updatedStones);
    const stoneElements = document.querySelectorAll('.stone');
    stoneElements.forEach((stoneElement, index) => {
        if (checkCollision(player, stoneElement) && !updatedStones[index].isHidden) {
            alert('Game Over!');
            clearInterval(gameInterval);
            returnMenu();
        }
    });
    if (checkWinCondition(updatedStones)) {
        alert('Você venceu!');
        clearInterval(gameInterval)
        window.location.href = 'game2.html'
    }
    return updatedStones;
  };
  
  const startGame = () => {
    let stones = [...initialStones];
    createAndRenderStoneElements(stones);
    document.addEventListener('click', (event) => {
        stones = handleClick(event, stones);
    });
    gameInterval = setInterval(() => {
        stones = gameLoop(stones);
    }, 100);
  };
  
  startGame();