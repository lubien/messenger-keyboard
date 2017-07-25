const ESC = 27
const ENTER = 13
const LEFT = 37
const UP = 38
const RIGHT = 39
const DOWN = 40
const KEY_J = 106
const KEY_K = 107

const MESSAGE_INPUT_SELECTOR = '._4rv3'
const CHAT_GRID_SELECTOR = 'ul[role="grid"]'
const SEARCH_INPUT_SELECTOR = '._58al'
const CURRENT_CHAT_SELECTOR = '._1ht2'
const SELECTED_CLASS = 'lubien-dangerously-selected'

const NEUTRAL_POSITION = -2
const SEARCH_POSITION = -1

const controls =
{ [ESC]: escKey
, [LEFT]: leftKey
, [UP]: upKey
, [RIGHT]: rightKey
, [DOWN]: downKey
, [KEY_J]: downKey
, [KEY_K]: upKey
, [ENTER]: enterKey
}

let $messageInput
let $chatGrid
let $seachInput 

let cursor = NEUTRAL_POSITION
let $currentNode = false

window.onload = () => {
  $messageInput = document.querySelector(MESSAGE_INPUT_SELECTOR)
  $chatGrid = document.querySelector(CHAT_GRID_SELECTOR)
  $seachInput = document.querySelector(SEARCH_INPUT_SELECTOR)
  
  const observer = new MutationObserver(gridMutated)
  observer.observe($chatGrid, {childList: true})
  
  document.onkeydown = onkeydown
  document.onkeypress = onkeypress
}

function onkeydown(ev) {
  const {keyCode} = ev

  if (!inAction()) {
    if (keyCode === ESC) {
      ev.preventDefault()
      startCursor()
    }
    return
  }

  if (controls.hasOwnProperty(keyCode))
    controls[keyCode](ev)
}

function onkeypress(ev) {
  const {keyCode} = ev

  if (!inAction()) return

  if (controls.hasOwnProperty(keyCode))
    controls[keyCode](ev)
}

function inAction() {
  return cursor !== NEUTRAL_POSITION
}

function startCursor() {
  move(currentChatIndex())
}

function stopCursor() {
  move(NEUTRAL_POSITION)
}

function move(pos) {
  if ($currentNode && !currentNodeIsSearch())
    unmarkSelected($currentNode)

  cursor = pos
  const isSearch = currentNodeIsSearch()
  $currentNode = isSearch
    ? $seachInput
    : $chatGrid.children[pos]

  if (!$currentNode) return
  
  $currentNode.scrollIntoViewIfNeeded()

  if (!isSearch)
    markSelected($currentNode)
  else
    $seachInput.focus()
}

function escKey(e) {
  e.preventDefault()
  stopCursor()
}

function leftKey(e) {
  if (currentNodeIsSearch()) return
  e.preventDefault()
  move(0)
}

function upKey(e) {
  e.preventDefault()
  move(clampPosition(cursor - 1))
}

function rightKey(e) {
  if (currentNodeIsSearch()) return
  e.preventDefault()
  move($chatGrid.children.length - 1)
}

function downKey(e) {
  e.preventDefault()
  move(clampPosition(cursor + 1))
}

function enterKey(e) {
  if (currentNodeIsSearch()) return
  e.preventDefault()
  selectChat()
}

function selectChat() {
  if (!inAction()) return

  const position = cursor
  const node = $currentNode
  stopCursor()
  node.querySelector('a').click()
}

function currentNodeIsSearch() {
  return cursor === SEARCH_POSITION
}

function gridMutated() {
  if (inAction())
    cursor = Array.prototype.indexOf.call($chatGrid.children, $currentNode)
}

function currentChatIndex() {
  const node = $chatGrid.querySelector(CURRENT_CHAT_SELECTOR)
  return Array.prototype.indexOf.call(node.parentNode.children, node)
}

function markSelected(node) {
  node.classList.add(SELECTED_CLASS)
}

function unmarkSelected(node) {
  node.classList.remove(SELECTED_CLASS)
}

function clampPosition(x) {
  const min = SEARCH_POSITION
  const max = $chatGrid.children.length - 1
  return Math.min(Math.max(min, x), max)
}