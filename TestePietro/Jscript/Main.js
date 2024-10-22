const initialStones = [
    { index: 0, x: 50, y: 50, speed: 1, isHidden: false },
    { index: 1, x: 150, y: 100, speed: 1, isHidden: false },
    { index: 2, x: 250, y: 150, speed: 2, isHidden: false },
];

const createStoneElements = (stones) => {
    return stones.map(stone => {
      const stoneElement = document.createElement('div');
      stoneElement.classList.add('stone')
      if (stone.isHidden) {
        stoneElement.classList.add('hidden')
      }
      stoneElement.style.left = `${stone.x}px`
      stoneElement.style.top = `${stone.y}px`
      return stoneElement
    })
  }
  
  const appendStonesToGame = ([...stoneElements]) => {
    const gameElement = document.getElementById('game')
    stoneElements.map(stoneElement => gameElement.appendChild(stoneElement))
  }

  const moveStones = (stones, centerX, centerY) => {
    const distanceX = centerX - stones.x
    const distanceY = centerY - stones.y

    const direction = Math.atan2(distanceY, distanceX)

    return {
        ...stones,
        x: stones.x + Math.cos(direction) * stones.speed,
        y: stones.y + Math.sin(direction) * stones.speed
    }
  }

  const updateStones = (stones, container) => {
    const centerX = container.offsetWidth / 2
    const centerY = container.offsetHeight / 2
    return stones.map((stone) => moveStones(stone, centerX, centerY))
  }

  const checkdistance = (centerX, centerY, stoneX, stoneY) => {
  const distX = centerX - stoneX
  const distY = centerY - stoneY
  return Math.sqrt(distX**2 + distY**2)
  }

  const checkCollision = (stones, centerX, centerY, centerHitbox) => {
    return stones.some((stone) => {
      const distance = checkdistance(centerX, centerY, stone.x, stone.y)
      return distance <= centerHitbox
    })
  }

  const loop = (stones, container) => {
    const centerX = container.offsetWidth / 2
    const centerY = container.offsetHeight / 2
    const centerHitbox = 20
    const newStones = updateStones(stones, container)
    container.innerHTML = ''
  
    const stoneElements = createStoneElements(newStones)
    appendStonesToGame(stoneElements)

    if (checkCollision(stones, centerX, centerY, centerHitbox)) {
      alert('Game Over!')
    return
    }

    requestAnimationFrame(() => loop(newStones, container))
  }

  const container = document.getElementById('game')
  loop(initialStones, container)