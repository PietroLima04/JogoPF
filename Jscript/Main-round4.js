//Comentário do código é igual ao Main

const Enemies = [
    { index: 0, x: 10, y: 20, speed: 15, isHidden: false },
    { index: 1, x: 750, y: 200, speed: 15, isHidden: false },
    { index: 2, x: 20, y: 250, speed: 15, isHidden: false },
    { index: 3, x: 500, y: 10, speed: 15, isHidden: false },
    { index: 4, x: 750, y: 550, speed: 15, isHidden: false },
    { index: 5, x: 750, y: 250, speed: 15, isHidden: false},
    { index: 6, x: 10, y: 750, speed: 15, isHidden: false},
];

const proximaFase = () => {
    window.location.href = 'index.html' //Função para para acessar próximo html referente a rodada.
}

const createEnemies = (enemies) => {
    const gameElement = document.getElementById('game')
    gameElement.innerHTML = ''
    enemies.map((enemy) => {
        const enemyElement = document.createElement('div')
        enemyElement.classList.add('enemy')
        enemyElement.dataset.index = enemy.index
        if (enemy.isHidden) {
            enemyElement.classList.add('hidden')
            enemyElement.style.display = 'none'
        } else {
            enemyElement.style.display = 'block'
            enemyElement.style.left = `${enemy.x}px`
            enemyElement.style.top = `${enemy.y}px`
        }
        gameElement.appendChild(enemyElement)
    })
}

const moveEnemies = (enemy, centerX, centerY) => {
    const distanceX = centerX - enemy.x
    const distanceY = centerY - enemy.y
    const direction = Math.atan2(distanceY, distanceX)
    return {
        ...enemy,
        x: enemy.x + Math.cos(direction) * enemy.speed,
        y: enemy.y + Math.sin(direction) * enemy.speed
    }
}

const updateEnemies = (enemies, container) => {
    const centerX = container.offsetWidth / 2
    const centerY = container.offsetHeight / 2
    return enemies.map((enemy) => moveEnemies(enemy, centerX, centerY))
}

const checkCollision = (player, enemyElement) => {
    const playerArea = player.getBoundingClientRect()
    const enemyArea = enemyElement.getBoundingClientRect()
    return !(playerArea.right < enemyArea.left ||
             playerArea.left > enemyArea.right ||
             playerArea.bottom < enemyArea.top ||
             playerArea.top > enemyArea.bottom)
}

const checkWinCondition = (enemies) => enemies.every((enemy) => enemy.isHidden)

const handleClick = (situation, enemies) => {
    return enemies.map((enemy) => {
        const enemyElement = document.querySelector(`.enemy[data-index="${enemy.index}"]`)
        const area = enemyElement.getBoundingClientRect()
        const isClicked = situation.clientX >= area.left && event.clientY <= area.right &&
                          situation.clientY >= area.top && situation.clientY <= area.bottom
        return isClicked ? { ...enemy, isHidden: true} : enemy                  
    })
}

const returnMenu = () => {
    window.location.href = 'index.html'
}

const gameLoop = (enemies) => {
    const player = document.getElementById('player')
    const updatedEnemies = updateEnemies(enemies, document.getElementById('game'))
    createEnemies(updatedEnemies)
    const enemyElements = document.querySelectorAll('.enemy')
    enemyElements.forEach((enemyElement, index) => {
        if (checkCollision(player, enemyElement) && !updatedEnemies[index.isHidden]) {
            alert('Game Over!')
            clearInterval(gameInterval)
            returnMenu()
        }
    })
    if (checkWinCondition(updatedEnemies)) {
        alert('Você venceu!')
        clearInterval(gameInterval)
        proximaFase()
    }
    return updatedEnemies
}

const startGame = () => {
    let enemies = [...Enemies]
    createEnemies(enemies)
    document.addEventListener('click', (event) => {
        enemies = handleClick(event, enemies)
    })
    gameInterval = setInterval(() => {
        enemies = gameLoop(enemies)
    }, 100)
}

startGame()