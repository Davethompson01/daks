// main.js
window.addEventListener('load', () => {
  // --- Kayan yazı (Marquee) mantığı ---
  const marquee = document.getElementById('marquee')
  let offset = 0
  let paused = false
  marquee.innerHTML += marquee.innerHTML
  function animateMarquee() {
    if (!paused) {
      offset -= 1
      if (Math.abs(offset) >= marquee.offsetWidth / 2) {
        offset = 0
      }
      marquee.style.transform = `translateX(${offset}px)`
    }
    requestAnimationFrame(animateMarquee)
  }
  animateMarquee()
  const marqueeWrapper = document.querySelector('.marquee-wrapper')
  marqueeWrapper.addEventListener('mousedown', () => { paused = true })
  marqueeWrapper.addEventListener('mouseup', () => { paused = false })
  marqueeWrapper.addEventListener('mouseleave', () => { paused = false })
  marqueeWrapper.addEventListener('touchstart', () => { paused = true }, { passive: true })
  marqueeWrapper.addEventListener('touchend', () => { paused = false })
  // --- ÇOKLU SÜRÜKLENEBİLİR RESİM OLUŞTURMA ---
  const assetContainer = document.getElementById('asset-container')
  const numberOfAssets = 29
  const assetAttributes = [
    { top: '1750px', left: '540px', width: '290px' },
    { top: '550px', left: '30px', width: '500px' },
    { top: '1350px', left: '865px', width: '220px' },
    { top: '2400px', left: '700px', width: '380px' },
    { top: '1550px', left: '1300px', width: '180px' },
    { top: '800px', left: '700px', width: '560px' },
    { top: '1050px', left: '100px', width: '540px' },
    { top: '1700px', left: '100px', width: '690px' },
    { top: '1850px', left: '1300px', width: '350px' },
    { top: '420px', left: '550px', width: '770px' },
    { top: '1950px', left: '900px', width: '150px' },
    { top: '2400px', left: '100px', width: '320px' },
    { top: '2850px', left: '850px', width: '450px' },
    { top: '880px', left: '1400px', width: '430px' },
    { top: '2800px', left: '500px', width: '280px' },
    { top: '900px', left: '100px', width: '200px' },
    { top: '2650px', left: '1300px', width: '560px' },
    { top: '3200px', left: '100px', width: '450px' },
    { top: '3850px', left: '400px', width: '190px' },
    { top: '480px', left: '1450px', width: '380px' },
    { top: '1310px', left: '1300px', width: '600px' },
    { top: '2100px', left: '770px', width: '150px' },
    { top: '2105px', left: '1020px', width: '150px' },
    { top: '3400px', left: '900px', width: '250px' },
    { top: '3605px', left: '1320px', width: '290px' },
    { top: '2205px', left: '1320px', width: '450px' },
    { top: '705px', left: '1120px', width: '450px' },
    { top: '3605px', left: '820px', width: '450px' },
    { top: '3605px', left: '1520px', width: '450px' }
  ]
  const ensureMinimumHeight = () => {
    const allAssets = document.querySelectorAll('.draggable-asset')
    let maxBottom = 0
    allAssets.forEach((el) => {
      const top = parseInt(el.style.top || '0', 10)
      const height = el.offsetHeight || 0
      const bottom = top + height
      if (bottom > maxBottom) { maxBottom = bottom }
    })
    document.body.style.minHeight = `${maxBottom + 100}px`
  }
  function getResponsiveAssetAttributes(attr) {
    const width = window.innerWidth
    let scale = 1
    let top = parseInt(attr.top)
    let left = parseInt(attr.left)
    let w = parseInt(attr.width)
    if (width > 1680) {
      return { top: attr.top, left: attr.left, width: attr.width }
    } else if (width <= 480) {
      return {
        top: `${Math.round((top * scale) % 1900)}px`,
        left: `${Math.round(left * scale > 480 ? ((left * scale) % 434) - 130 : left * scale)}px`,
        width: `${Math.round(w * scale)}px`,
      }
    } else if (width <= 768) { scale = 0.35 }
    else if (width <= 1024) { scale = 0.53 }
    else if (width <= 1440) { scale = 0.78 }
    else if (width <= 1680) { scale = 0.89 }
    return {
      top: `${Math.round(top * scale)}px`,
      left: `${Math.round(left * scale)}px`,
      width: `${Math.round(w * scale)}px`,
    }
  }
  for (let i = 0; i < numberOfAssets; i++) {
    const imgElement = document.createElement('img')
    imgElement.dataset.src = i === 25 || i === 26 || i === 27 ? `assets/${i}.gif` : `assets/${i}.png`
    imgElement.alt = `Sürüklenebilir Görsel ${i}`
    imgElement.classList.add('draggable-asset')
    imgElement.setAttribute('draggable', 'false')
    if (assetAttributes[i]) {
      const responsive = getResponsiveAssetAttributes(assetAttributes[i])
      imgElement.style.top = responsive.top
      imgElement.style.left = responsive.left
      imgElement.style.width = responsive.width
    }
    assetContainer.appendChild(imgElement)
  }
  document.body.style.backgroundImage = "url('assets/bg.png')"
  let loadedCount = 0
  const allImages = document.querySelectorAll('.draggable-asset')
  allImages.forEach((img) => {
    img.onload = () => {
      img.classList.add('loaded')
      loadedCount++
      if (loadedCount === allImages.length) { ensureMinimumHeight() }
    }
    img.onerror = function () {
      this.onerror = null
      this.src = `https://placehold.co/150x150/f97316/white?text=Hata`
      this.classList.add('loaded')
      loadedCount++
      if (loadedCount === allImages.length) { ensureMinimumHeight() }
    }
    img.src = img.dataset.src
  })
  let currentDraggable = null
  let isDragging = false
  let highestZ = 10
  let startTop = 0, startLeft = 0
  let startMouseX = 0, startMouseY = 0
  function onDragStart(e) {
    const target = e.target
    if (!target.classList.contains('draggable-asset')) return
    e.preventDefault()
    currentDraggable = target
    isDragging = true
    highestZ++
    currentDraggable.style.zIndex = highestZ
    currentDraggable.classList.add('dragging')
    startMouseX = e.clientX || e.touches[0].clientX
    startMouseY = e.clientY || e.touches[0].clientY
    startLeft = parseInt(currentDraggable.style.left, 10)
    startTop = parseInt(currentDraggable.style.top, 10)
  }
  function onDrag(e) {
    if (!isDragging || !currentDraggable) return
    const currentMouseX = e.clientX || e.touches[0].clientX
    const currentMouseY = e.clientY || e.touches[0].clientY
    const deltaX = currentMouseX - startMouseX
    const deltaY = currentMouseY - startMouseY
    requestAnimationFrame(() => {
      if (!isDragging) return
      currentDraggable.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`
    })
  }
  function onDragEnd(e) {
    if (!isDragging || !currentDraggable) return
    isDragging = false
    const computedStyle = window.getComputedStyle(currentDraggable)
    const transformMatrix = new DOMMatrix(computedStyle.transform)
    const finalDeltaX = transformMatrix.m41
    const finalDeltaY = transformMatrix.m42
    let newLeft = startLeft + finalDeltaX
    let newTop = startTop + finalDeltaY
    const elHeight = currentDraggable.offsetHeight
    const elWidth = currentDraggable.offsetWidth
    const bodyWidth = document.body.clientWidth
    const boundaryHeight = document.body.offsetHeight
    if (newTop + elHeight > boundaryHeight) {
      newTop = boundaryHeight - elHeight
    }
    currentDraggable.style.left = `${newLeft}px`
    currentDraggable.style.top = `${newTop}px`
    currentDraggable.style.transform = ''
    currentDraggable.classList.remove('dragging')
    currentDraggable = null
  }
  document.addEventListener('mousedown', onDragStart)
  document.addEventListener('touchstart', onDragStart, { passive: false })
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('touchmove', onDrag, { passive: false })
  document.addEventListener('mouseup', onDragEnd)
  document.addEventListener('touchend', onDragEnd)
})
