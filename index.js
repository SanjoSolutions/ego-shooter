import { createFullDocumentCanvas } from './unnamed/createFullDocumentCanvas/createFullDocumentCanvas.js'
import { distance } from './unnamed/distance.js'
import { animate } from './unnamed/packages/animate/animate.js'
import { randomInteger } from './unnamed/randomInteger.js'

export async function main() {
  const { canvas, context } = createFullDocumentCanvas()
  document.body.appendChild(canvas)

  canvas.addEventListener('click', function () {
    canvas.requestPointerLock()
  })

  let target = {x: 0, y: 0}

  function generateCircle() {
    return {
      radius: 10,
      x: randomInteger(target.x - window.innerWidth / 2, target.x + window.innerWidth / 2),
      y: randomInteger(target.y - window.innerHeight / 2, target.y + window.innerHeight / 2)
    }
  }

  let circle = generateCircle()

  function render() {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight)
    drawCrosshair()
    context.save()
    context.translate(
       window.innerWidth / 2 - target.x,
      target.y - window.innerHeight / 2
    )
    drawCircle(circle)
    context.restore()
  }

  function drawCrosshair() {
    const center = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    }
    context.fillRect(center.x, center.y, 1, 1)
  }

  function drawCircle({x, y, radius}) {
    context.beginPath()
    context.arc(x, window.innerHeight - y, radius, 0, 2 * Math.PI)
    context.stroke()
  }

  function onPointerMove(event) {
    const mouseSensitivity = 0.1
    target.x += mouseSensitivity * event.movementX
    target.y -= mouseSensitivity * event.movementY
  }

  function addPointerMoveEventListener() {
    window.addEventListener('pointermove', onPointerMove)
  }

  function removePointerMoveEventListener() {
    window.removeEventListener('pointermove', onPointerMove)
  }

  function isPointerLocked() {
    return document.pointerLockElement === canvas
  }

  document.addEventListener('pointerlockchange', function () {
    if (isPointerLocked()) {
      addPointerMoveEventListener()
      addPointerClickEventListener()
    } else {
      removePointerMoveEventListener()
      removePointerClickEventListener()
    }
  })

  function onClick() {
    if (isPointerOnTarget()) {
      circle = generateCircle()
    }
  }

  function isPointerOnTarget() {
    return distance(circle, target) <= circle.radius
  }

  function addPointerClickEventListener() {
    window.addEventListener('click', onClick)
  }

  function removePointerClickEventListener() {
    window.removeEventListener('click', onClick)
  }

  animate(render)
}
