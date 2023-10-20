// Matter modules
const { Render,World, Runner, Engine, Bodies, Composite, Composites, Constraint, Mouse, MouseConstraint, Events, Body } = Matter


let{ name, posX, posY, radius, physics, grow, maxGrow, spec } = getRandomBird();
let characterName = document.getElementById("characterName");
characterName.textContent = name; 

// Game distribution
const gameSize = { w: window.innerWidth, h: window.innerHeight }
const baseProps = { w: 150, h: 20, posX: gameSize.w - 300, posY: gameSize.h - 200 }
const bricksProps = { w: baseProps.w / 5, h: 30, posX: baseProps.posX - baseProps.w / 2, posY: 50, cols: 5, rows: 10 }

const engine = Engine.create()
const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: gameSize.w,
        height: gameSize.h,
        wireframes: false,
        background: 'white',
    },
})


//Donde el jugador coloca las pelotas
const arena = Bodies.rectangle(1400, 250, 300, 20, { isStatic: true, render:{ fillStyle: 'black'} });

//Donde el jugador coloca las pelotas
const arena2 = Bodies.rectangle(1800, 100, 300, 20, { isStatic: true, render:{ fillStyle: 'black'} });

//Donde el jugador coloca las pelotas
const arena3 = Bodies.rectangle(2000, 400, 300, 20, { isStatic: true, render:{ fillStyle: 'black'} });

//Donde el jugador coloca las pelotas
const arena4 = Bodies.rectangle(1600, 500, 300, 20, { isStatic: true, render:{ fillStyle: 'black'} });

//Donde el jugador coloca las pelotas
const arena5 = Bodies.rectangle(1600, 600, 300, 20, { isStatic: true, render:{ fillStyle: 'black'}});

//Cerdo
const pig = Bodies.circle(1600, 450, 20, {
    render:{
        fillStyle: 'lightgreen'
      }
})

//Cerdo2
const pig2 = Bodies.circle(2000, 350, 20, {
    render:{
        fillStyle: 'blue'
      }
})

//Cerdo3
const pig3 = Bodies.circle(1400, 200, 20, {
    render:{
        fillStyle: 'red'
      }
})

//Cerdo4
const pig4 = Bodies.circle(1600, 500, 20, {
    render:{
        fillStyle: 'yellow'
      }
})

//Cerdo5
const pig5 = Bodies.circle(1800, 50, 20, {
    render:{
        fillStyle: 'green'
      }
})

//Crear el pájaro
// Función para crear un nuevo pájaro
function createNewBird() {
    const newBird = Bodies.circle(posX, posY, radius, physics);
    newBird.divisionDistance = 1600;
    return newBird;
}

let bird = createNewBird();
let current = bird

//Pájaro que se divide
let distanceTraveled = 0;
let isFiring = false;

Events.on(engine, 'afterUpdate', () => {
    if (isFiring) {
        distanceTraveled += bird.speed;

        if (distanceTraveled >= bird.divisionDistance && name === 'Divisor') {
            isFiring = false; // Detén el disparo
            World.remove(engine.world, shooter, true); // Elimina el tirachinas

            // Divide el pájaro en tres bolas
            const newBirds = Composites.softBody(
                bird.position.x, bird.position.y, 3, 1, 0, 0, true, 20, {
                    friction: 0.001,
                    frictionStatic: 0.5,
                    frictionAir: 0.02,
                    circleRadius: 10
                }
            );

            World.add(engine.world, newBirds.bodies);
        }
    }
});


//Para el disparo
const shooter = Constraint.create({
    pointA: { x: posX, y: posY },
    bodyB: bird,
    stiffness: 0.05,
})

const mouse = Mouse.create(render.canvas)
const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        render: { visible: false }
    }
})

render.mouse = mouse

//Posicion para tirar la pelota
Events.on(mouseConstraint, 'enddrag', (e) => {
    if (e.body === bird && !isFiring) { 
        isFiring = true;
    }
})

//Le diste a la cerda
let collision = 0
let isBirdHit = false; 


Events.on(engine, 'collisionStart', (e) => {
    if (!isBirdHit) {  // Verifica si la colisión no ha sido contada antes
        const pairs = e.pairs;
        pairs.forEach((pair) => {
            if ((pair.bodyA === bird && pair.bodyB === pig) || (pair.bodyA === pig && pair.bodyB === bird)) {
                alert('MUESTRA TU MANO: muestra tu mano a los demas juagdores.')
                isBirdHit = true;
            } else if ((pair.bodyA === bird && pair.bodyB === pig2) || (pair.bodyA === pig2 && pair.bodyB === bird)) {
                alert('GUERRA: todos los jugadores muestran sus cartas, el jugador con la carta mas alta la descarta.')
                isBirdHit = true;
            }else if ((pair.bodyA === bird && pair.bodyB === pig3) || (pair.bodyA === pig3 && pair.bodyB === bird)) {
                alert('ROBA ROJO: roba hasta que te salga una carta roja.')
                isBirdHit = true;
            }else if ((pair.bodyA === bird && pair.bodyB === pig4) || (pair.bodyA === pig4 && pair.bodyB === bird)) {
                alert('INTERCAMBIO DE MANO: intercambien sus mano hacia la izquierda.')
                isBirdHit = true;
            }else if ((pair.bodyA === bird && pair.bodyB === pig5) || (pair.bodyA === pig5 && pair.bodyB === bird)) {
                alert('CASI UNO: descarta todas, salvo 2 de tus cartas.')
                isBirdHit = true;
            }
        });
    }
});

//Sumar puntos cuando se cae un cuadro
Events.on(engine, 'afterUpdate', () => {
    if (isFiring) {
        Composite.remove(engine.world, shooter, true)
        if (grow && bird.circleRadius < maxGrow) {
            Body.scale(bird, grow, grow)
        }
    }

    score.textContent = bricks.bodies.filter(elm => elm.position.y > gameSize.h).length
})

//Agregar los elementos al canvas
World.add(engine.world, [pig, pig2, pig3, pig4, pig5 ,arena,arena2,arena3,arena4,arena5, bird, shooter, mouseConstraint])

Runner.run(engine)
Render.run(render)