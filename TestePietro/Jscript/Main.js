const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const initialStones = [
    { index: 0, x: 50, y: 50, speed: 1, isHidden: false },
    { index: 1, x: 150, y: 100, speed: 1, isHidden: false },
    { index: 2, x: 250, y: 150, speed: 2, isHidden: false },
];

const createStoneElements = (stones) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
    stones.forEach(stone => {
        if (!stone.isHidden) {
            ctx.beginPath();
            ctx.arc(stone.x, stone.y, 15, 0, 2 * Math.PI); // Desenha a pedra
            ctx.fill();
        }
    });
};

const handleClick = (event, stones) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    return stones.map(stone => {
        const distance = Math.sqrt((stone.x - x) ** 2 + (stone.y - y) ** 2);
        const isClicked = distance < 15; // Verifica se o clique está dentro do raio da pedra
        return isClicked ? { ...stone, isHidden: true } : stone;
    });
};

canvas.addEventListener('click', (event) => {
    initialStones = handleClick(event, initialStones);
    createStoneElements(initialStones);
});

createStoneElements(initialStones);
