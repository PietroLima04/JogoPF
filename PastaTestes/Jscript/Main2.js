const initialStones = [
    { index: 0, x: 50, y: 50, speed: 9, isHidden: false },
    { index: 1, x: 150, y: 100, speed: 9, isHidden: false },
    { index: 2, x: 500, y: 150, speed: 9, isHidden: false },
    { index: 3, x: 200, y: 500, speed: 9, isHidden: false },
    { index: 4, x: 700, y: 700, speed: 9, isHidden: false },
];

const delayTime = 2000; // 2000 ms = 2 segundos

const renderStones = (stones) => {
    stones.forEach(stone => {
        const stoneElement = document.querySelector(`.stone[data-index="${stone.index}"]`);
        if (stone.isHidden) {
            stoneElement.style.display = 'none';
        } else {
            stoneElement.style.display = 'block';
            stoneElement.style.left = `${stone.x}px`;
            stoneElement.style.top = `${stone.y}px`;
        }
    });
};

const checkCollision = (player, stoneElement) => {
    const playerRect = player.getBoundingClientRect();
    const stoneRect = stoneElement.getBoundingClientRect();
    
    return !(playerRect.right < stoneRect.left || 
             playerRect.left > stoneRect.right || 
             playerRect.bottom < stoneRect.top || 
             playerRect.top > stoneRect.bottom);
};

const moveStones = (stones, player) => stones.map(stone => {
    if (stone.isHidden) return stone; // Não move pedras escondidas
    
    const playerRect = player.getBoundingClientRect();
    const gameRect = document.getElementById('game').getBoundingClientRect();
    
    // Coordenadas do jogador
    const playerX = playerRect.left + playerRect.width / 2 - gameRect.left;
    const playerY = playerRect.top + playerRect.height / 2 - gameRect.top;

    // Direção para a pedra se mover
    const directionX = playerX - stone.x;
    const directionY = playerY - stone.y;
    const distance = Math.sqrt(directionX ** 2 + directionY ** 2);
    
    return distance > 0
        ? { ...stone, x: stone.x + (directionX / distance) * stone.speed, y: stone.y + (directionY / distance) * stone.speed }
        : stone;
});

const handleClick = (event, stones) => {
    return stones.map(stone => {
        const stoneElement = document.querySelector(`.stone[data-index="${stone.index}"]`);
        const rect = stoneElement.getBoundingClientRect();
        const isClicked = event.clientX >= rect.left && event.clientX <= rect.right &&
                          event.clientY >= rect.top && event.clientY <= rect.bottom;
        
        return isClicked ? { ...stone, isHidden: true } : stone;
    });
};

const checkWinCondition = (stones) => stones.every(stone => stone.isHidden);

const gameLoop = (stones) => {
    const player = document.getElementById('player');
    const updatedStones = moveStones(stones, player);
    renderStones(updatedStones);

    const stoneElements = document.querySelectorAll('.stone');
    stoneElements.forEach((stoneElement, index) => {
        if (checkCollision(player, stoneElement) && !updatedStones[index].isHidden) {
            alert('Game Over!');
            clearInterval(gameInterval);
            window.location.href = 'index.html'
        }
    });

    if (checkWinCondition(updatedStones)) {
        alert('Você venceu!');
        clearInterval(gameInterval);
        window.location.href = 'game3.html'
        
    }

    return updatedStones;
};

const startGame = () => {
    let stones = [...initialStones];
    renderStones(stones);
    document.addEventListener('click', (event) => {
        stones = handleClick(event, stones);
    });
    setTimeout(() => {
        gameInterval = setInterval(() => {
            stones = gameLoop(stones);
        }, 100);
    }, delayTime); // Adiciona o atraso antes de iniciar o loop do jogo
};

startGame();

