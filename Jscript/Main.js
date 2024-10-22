//O array Enemies define um grupo de inimigos no jogo com propriedades para posição, velocidade, identificador único e estado de 
//visibilidade.

const Enemies = [
    { index: 0, x: 100, y: 100, speed: 3, isHidden: false },
    { index: 1, x: 650, y: 200, speed: 3, isHidden: false },
    { index: 2, x: 600, y: 600, speed: 3, isHidden: false },
    { index: 3, x: 300, y: 750, speed: 3, isHidden: false },
  ];

const proximaFase = () => {
    window.location.href = 'game-round2.html' //Função para para acessar próximo html referente a rodada.
}

//A função createEnemies cria elementos HTML para os inimigos, limpa o conteúdo do elemento 'game', adiciona classes e propriedades 
//com base nas características dos inimigos e os posiciona na tela.

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

//A função moveEnemies calcula a nova posição de um inimigo, movendo-o em direção ao centro do jogo. Usa a distância e o ângulo para 
//atualizar as coordenadas X e Y, movendo o inimigo gradualmente para o centro.

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

//A função updateEnemies move os inimigos em direção ao centro do jogo, calculando as coordenadas centrais e atualizando suas posições 
//com a função moveEnemies.

const updateEnemies = (enemies, container) => {
    const centerX = container.offsetWidth / 2
    const centerY = container.offsetHeight / 2
    return enemies.map((enemy) => moveEnemies(enemy, centerX, centerY))
}

//A função checkCollision determina se o jogador e um inimigo colidem comparando as áreas que ambos ocupam na tela.

const checkCollision = (player, enemyElement) => {
    const playerArea = player.getBoundingClientRect()
    const enemyArea = enemyElement.getBoundingClientRect()
    return !(playerArea.right < enemyArea.left ||
             playerArea.left > enemyArea.right ||
             playerArea.bottom < enemyArea.top ||
             playerArea.top > enemyArea.bottom)
}

//A função checkWinCondition usa every para verificar se todos os inimigos estão escondidos, retornando true se estiverem e indicando
//a vitória do jogador.

const checkWinCondition = (enemies) => enemies.every((enemy) => enemy.isHidden)

//função que irá configurar o sistema de clique
const handleClick = (situation, enemies) => {
    return enemies.map((enemy) => { //inicialmente aplicará um map na lista de inimigos
        const enemyElement = document.querySelector(`.enemy[data-index="${enemy.index}"]`) //pegará o elemento do html correspondente ao inimigo, utilizando o index para se basear
        const area = enemyElement.getBoundingClientRect() //determinará basicamente a área do inimigo, levando em conta seu tamanho e sua posição
        const isClicked = situation.clientX >= area.left && situation.clientY <= area.right && //constante que servirá para checar se o clique foi feito dentro da área do inimigo, utilizando o elemento area
                          situation.clientY >= area.top && situation.clientY <= area.bottom
        return isClicked ? { ...enemy, isHidden: true} : enemy //caso o inimigo, retornará este novo elemento hidden                 
    })
}

//função que vai fazer o jogo voltar ao menu, será utilizada para o gameover
const returnMenu = () => {
    window.location.href = 'index.html'
}

//função que estabelecerá o loop do jogo
const gameLoop = (enemies) => {
    const player = document.getElementById('player') //vai selecionar o elemento com id = player no html
    const updatedEnemies = updateEnemies(enemies, document.getElementById('game')) //vai ficar chamando a função updateEnemies para atualizar a posição dos inimigos
    createEnemies(updatedEnemies) //vai criar novos inimigos com base nas novas posições e excluir os antigos
    const enemyElements = document.querySelectorAll('.enemy') //vai selecionar todos os inimigos
    enemyElements.forEach((enemyElement, index) => {
        if (checkCollision(player, enemyElement) && !updatedEnemies[index.isHidden]) {
            alert('Game Over!')
            clearInterval(gameInterval)
            returnMenu()
        }
    })
    if (checkWinCondition(updatedEnemies)) { //caso a condição de vitória seja alcançada, exibirá a mensagem e passará para a próxima fase
        alert('Você venceu!')
        clearInterval(gameInterval)
        proximaFase()
    }
    return updatedEnemies //vai retornar os inimigos atualizados
}

//função que iniciará o game loop
const startGame = () => {
    let enemies = [...Enemies] //cria uma cópia para não alterar a lista inicial
    createEnemies(enemies) //vai establecer os inimigos na tela
    document.addEventListener('click', (event) => { //função que vai determinar que quando um clique for detectado executará a função handleclick
        enemies = handleClick(event, enemies) 
    })
    gameInterval = setInterval(() => { //vai estabelecer o gameloop sendo chamado a cada 100 milisegundos
        enemies = gameLoop(enemies)
    }, 100)
}

startGame() //chamada da função para iniciar tudo