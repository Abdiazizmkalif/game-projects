const board = document.querySelector(".board")
const snake = document.querySelectorAll(".snake")
const score = document.querySelector(".score")
const BestScoreElem = document.querySelector(".highest-score")

let snakeParts = [[5,3]]
let foodPosition = []

let movingRight = false
let movingLeft = false
let movingUp = false
let movingDown = false
let isMoving = false
let moveInterval;
let count = 0
let bestScore = 0;
let keyPressed;
let gridWidth = 15
let gridHeight = 15


if (localStorage.length !== 0) {
    bestScore = localStorage.getItem("bestScore")
    BestScoreElem.textContent = "Best Score: " + bestScore
}


let updateFood = () => {
    const food = document.querySelector(".food")
    let isValidPosition = false

    while(!isValidPosition) {
        let x = Math.floor(Math.random() * gridWidth) + 1
        let y = Math.floor(Math.random() * gridHeight) + 1
    
        isValidPosition = !snakeParts.some(([py, px]) => py === y && px === x)
    
        if (isValidPosition) {
            foodPosition = [y, x]
            food.style.gridArea = `${y} / ${x}`
        }
    }
}
updateFood()

let snakeTail = []

function addEyes (snakeHead) {
    if (!snakeHead.querySelector(".eye")) {
        snakeHead.classList.add('snakehead')
        let eyeOne = document.createElement("div")
        eyeOne.classList.add("eye")
        snakeHead.appendChild(eyeOne)
    
        let eyeTwo = document.createElement("div")
        eyeTwo.classList.add("eye")
        snakeHead.appendChild(eyeTwo)
    }
}


let snakeMove = () => {
    const snake = document.querySelectorAll(".snake")
    
    for (let i = 0; i < snakeParts.length; i++) {
        if (i === snake.length-1) {
            snake[i].style.backgroundColor = "#bf0707"
            
            addEyes(snake[i])
            updateDirection(snake[i])
            snake[i].style.borderRadius = "10px"
        } else {
            snake[i].classList.remove("snakehead")
            snake[i].style.backgroundColor = "#950808"
            snake[i].style.borderRadius = "4px"
            snake[i].innerHTML = ''
        }

        let y = snakeParts[i][0]
        let x = snakeParts[i][1]

        snake[i].style.gridArea = `${y} / ${x}`
    }
    snakeHeadCollidesWithFood()
}

function snakeHeadCollidesWithFood() {
    let snakeHead = snakeParts[snakeParts.length-1]
    if (snakeHead[0] === foodPosition[0] && snakeHead[1] === foodPosition[1]) {
        board.innerHTML += `<div class="snake"></div>`
        snakeParts.unshift(snakeTail)
        score.textContent = `Score: ${++count}`
        updateFood()
        snakeMove()
        adjustSpeed()
    }
}

function adjustSpeed() {
    clearInterval(moveInterval)
    const speed = Math.max(100, 250 - count * 5)
    moveInterval = setInterval(snakeMoveAuto, speed)
}
snakeMove()


function updateDirection(snakeHead) {
    const eyeOne = snakeHead.querySelector(".eye:first-child")
    const eyeTwo = snakeHead.querySelector(".eye:last-child")

    switch (keyPressed) {
        case "ArrowRight":
            if (direction.x !== -1) {
                eyeOne.style.cssText = "top: 4px; right: 4px"
                eyeTwo.style.cssText = "bottom: 4px; right: 4px"
            }
            break
        case "ArrowLeft":
            if (direction.x !== 1) {
                eyeOne.style.cssText = "top: 4px; left: 4px"
                eyeTwo.style.cssText = "bottom: 4px; left: 4px"
            }
            break
        case "ArrowDown":
            if (direction.y !== -1) {
                eyeOne.style.cssText = "bottom: 4px; left: 4px"
                eyeTwo.style.cssText = "bottom: 4px; right: 4px"
            }
            break
        case "ArrowUp":
            if (direction.y !== 1) {
                eyeOne.style.cssText = "top: 4px; left: 4px"
                eyeTwo.style.cssText = "top: 4px; right: 4px"
            }
            break
        default:
            eyeOne.style.cssText = "top: 4px; right: 4px"
            eyeTwo.style.cssText = "bottom: 4px; right: 4px"
    }
}

let direction = {x: 0, y: 0}
let prevDirection = {x: 0, y: 0}
let xy = 1

let handleKeyPress = (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "ArrowDown") {
        let tempArr = []
        let snakeHead = snakeParts[snakeParts.length-1]

        keyPressed = e.key
        
        switch (e.key) {
            case "ArrowRight":
                if (direction.x !== -1 && direction.x !== 1) direction = {x: 1, y: 0}
                break
            case "ArrowLeft":
                if (direction.x !== 1 && direction.x !== -1) direction = {x: -1, y: 0}
                break
            case "ArrowDown":
                if (direction.y !== -1 && direction.y !== 1) direction = {x: 0, y: 1}
                break
            case "ArrowUp":
                if (direction.y !== 1 && direction.y !== -1) direction = {x: 0, y: -1}
        }
        if (direction.x !== prevDirection.x || direction.y !== prevDirection.y) {
            tempArr.push([snakeHead[0] + direction.y, snakeHead[1] + direction.x])
            prevDirection.x = direction.x, prevDirection.y = direction.y
        }

        updateSnake(tempArr)

        if (!isMoving) clearInterval(moveInterval)
        snakeMove()
        if (!isMoving) {
            moveInterval = setInterval(() => {
                snakeMoveAuto()
                isMoving = true
            }, 250);
        }
    }
}

document.addEventListener("keydown", handleKeyPress)

function updateSnake(tempArr) {
    snakeTail = snakeParts[0]
    for (let i = 0; i < snakeParts.length; i++) {

        
        if (tempArr[0] === undefined) {
            break
        } else if (i === snakeParts.length - 1) {
            snakeParts[i] = tempArr[0]
        } else {
            snakeParts[i] = snakeParts[i+1]
        }
    }
}

let snakeMoveAuto = () => {

    let tempArr = []
    let snakeHead = snakeParts[snakeParts.length-1]

    switch (keyPressed) {
        case "ArrowRight":
            if (direction.x !== -1) direction = {x: 1, y: 0}
            break
        case "ArrowLeft":
            if (direction.x !== 1) direction = {x: -1, y: 0}
            break
        case "ArrowDown":
            if (direction.y !== -1) direction = {x: 0, y: 1}
            break
        case "ArrowUp":
            if (direction.y !== 1) direction = {x: 0, y: -1}
            break
    }

    tempArr.push([snakeHead[0] + direction.y, snakeHead[1] + direction.x])

    updateSnake(tempArr)

    function hasCollisionWithItself() {
        const snakeBody = new Set(
            snakeParts.slice(0, -1).map(([y, x]) => `${y},${x}`)
        )
        let head = snakeParts[snakeParts.length - 1]
        const collidedWtihItself = snakeBody.has(`${head[0]},${head[1]}`)
        const collidedWithWall = head[1] > gridWidth || head[1] < 1 || head[0] > gridHeight || head[0] < 1
        if (collidedWtihItself) {
            return collidedWtihItself
        } else if (collidedWithWall) {
            return collidedWithWall
        }
    }

    function showGameOver() {
        const gameOverScreen = document.querySelector(".game-over")
        gameOverScreen.style.display = "block"
        clearInterval(moveInterval)
        document.removeEventListener('keydown', handleKeyPress)
    }

    if (hasCollisionWithItself()) {
        if (bestScore < count) {
            BestScoreElem.textContent = "Best Score: " + count
            localStorage.setItem("bestScore", count)
        }
        showGameOver()
    }
    if (!hasCollisionWithItself()) snakeMove()

}