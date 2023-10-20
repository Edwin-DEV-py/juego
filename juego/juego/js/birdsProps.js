const getRandomBird = () => {

    const birds = [
        {
            name: 'Expansivo',
            radius: 10,
            posX: 300,
            posY: 500,
            grow: 1.1,
            maxGrow: 30,
            physics: {
                density: 0.01,
                frictionAir: 0.01
            }
        },
    ]

    return birds[Math.floor(Math.random() * birds.length)]
}