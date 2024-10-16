//teste que implementa rodadas, será modificado futuramente para a funcionalidade do código. Algumas das funções como as de 
//criação de inimigos e a do clique em inimigos já foram feitas, porém, isso será modificado posteriormente no código principal. 


//função que cria inimigos
const createEnemy = () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    alive: true,
  });
  
  //inicia rodadas
  const startRound = (round) => Array.from({ length: round * 5 }, createEnemy);
  
  //filtra os inimigos que ainda estão vivos
  const filterEnemies = (enemies) => enemies.filter(enemy => enemy.alive);
  
  //como o clique funciona
  const handleClick = (enemies, clickX, clickY) => 
    enemies.map(enemy => ({
      ...enemy,
      alive: !(Math.abs(enemy.x - clickX) < 10 && Math.abs(enemy.y - clickY) < 10),
    }));
  
    // lógica de progressão de rodadas do jogo
  const update = (round, enemies) => {
    const filteredEnemies = filterEnemies(enemies);
    
    if (filteredEnemies.length === 0) {
      return {
        round: round + 1,
        enemies: startRound(round + 1),
      };
    }
    
    return {
      round,
      enemies: filteredEnemies,
    };
  };
  
  // define o estado inicial do jogo
  const initialState = {
    round: 1,
    enemies: startRound(1),
  };
  
  //lógica de atualização do jogo
  const gameLoop = (state) => {
    // Lógica de renderização e atualização
    const newState = update(state.round, state.enemies);
    requestAnimationFrame(() => gameLoop(newState));
  };
  
  //está sendo usada para detectar cliques e, com isso, manipular os inimigos
  canvas.addEventListener('click', (event) => {
    const clickX = event.clientX;
    const clickY = event.clientY;
    initialState.enemies = handleClick(initialState.enemies, clickX, clickY);
  });
  
  gameLoop(initialState);
  