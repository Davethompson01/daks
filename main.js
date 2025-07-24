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
  marqueeWrapper.addEventListener('mousedown', () => {
    paused = true
  })
  marqueeWrapper.addEventListener('mouseup', () => {
    paused = false
  })
  marqueeWrapper.addEventListener('mouseleave', () => {
    paused = false
  })
  marqueeWrapper.addEventListener(
    'touchstart',
    () => {
      paused = true
    },
    { passive: true },
  )
  marqueeWrapper.addEventListener('touchend', () => {
    paused = false
  })

  // --- ÇOKLU SÜRÜKLENEBİLİR RESİM OLUŞTURMA ---
  const assetContainer = document.getElementById('asset-container')
  const numberOfAssets = 29

  const assetAttributes = [
    { top: '1750px', left: '540px', width: '290px' }, // 0.png
    { top: '550px', left: '30px', width: '500px' }, // 1.png
    { top: '1350px', left: '865px', width: '220px' }, // 2.png
    { top: '2400px', left: '700px', width: '380px' }, // 3.png
    { top: '1550px', left: '1300px', width: '180px' }, // 4.png
    { top: '800px', left: '700px', width: '560px' }, // 5.png
    { top: '1050px', left: '100px', width: '540px' }, // 6.png
    { top: '1700px', left: '100px', width: '690px' }, // 7.png
    { top: '1850px', left: '1300px', width: '350px' }, // 8.png
    { top: '420px', left: '550px', width: '770px' }, // 9.png
    { top: '1950px', left: '900px', width: '150px' }, // 10.png
    { top: '2400px', left: '100px', width: '320px' }, // 11.png
    { top: '2850px', left: '850px', width: '450px' }, // 12.png
    { top: '880px', left: '1400px', width: '430px' }, // 13.png
    { top: '2800px', left: '500px', width: '280px' }, // 14.png
    { top: '900px', left: '100px', width: '200px' }, // 15.png
    { top: '2650px', left: '1300px', width: '560px' }, // 16.png
    { top: '3200px', left: '100px', width: '450px' }, // 17.png
    { top: '3850px', left: '400px', width: '190px' }, // 18.png
    { top: '480px', left: '1450px', width: '380px' }, // 19.png
    { top: '1310px', left: '1300px', width: '600px' }, // 20.png
    { top: '2100px', left: '770px', width: '150px' }, // 21.png
    { top: '2105px', left: '1020px', width: '150px' }, // 22.png
    { top: '3400px', left: '900px', width: '250px' }, // 23.png
    { top: '3605px', left: '1320px', width: '290px' }, // 24.png
    { top: '2205px', left: '1320px', width: '450px' }, // 25.png
    { top: '705px', left: '1120px', width: '450px' }, // 26.png
    { top: '3605px', left: '820px', width: '450px' }, // 27.png
    { top: '3605px', left: '1520px', width: '450px' } // 28.png
  ]

  const ensureMinimumHeight = () => {
    const allAssets = document.querySelectorAll('.draggable-asset')
    let maxBottom = 0

    allAssets.forEach((el) => {
      const top = parseInt(el.style.top || '0', 10)
      const height = el.offsetHeight || 0
      const bottom = top + height
      if (bottom > maxBottom) {
        maxBottom = bottom
      }
    })

    // 100px boşluk payı ekle
    document.body.style.minHeight = `${maxBottom + 100}px`
  }

  // Responsive asset positioning and scaling
  function getResponsiveAssetAttributes(attr) {
    const width = window.innerWidth
    let scale = 1
    let top = parseInt(attr.top)
    let left = parseInt(attr.left)
    let w = parseInt(attr.width)
    if (width > 1680) {
      // Desktop: use original values
      return {
        top: attr.top,
        left: attr.left,
        width: attr.width,
      }
    } else if (width <= 480) {
      console.log(width)
      return {
        top: `${Math.round((top * scale) % 1900)}px`,
        left: `${Math.round(left * scale > 480 ? ((left * scale) % 434) - 130 : left * scale)}px`,
        width: `${Math.round(w * scale)}px`,
      }
    } else if (width <= 768) {
      scale = 0.35
    } else if (width <= 1024) {
      scale = 0.53
    } else if (width <= 1440) {
      scale = 0.78
    } else if (width <= 1680) {
      scale = 0.89
    }
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

  // --- LAZY LOADING MANTIĞI ---
  document.body.style.backgroundImage = "url('assets/bg.png')"
  let loadedCount = 0
  const allImages = document.querySelectorAll('.draggable-asset')

  allImages.forEach((img) => {
    img.onload = () => {
      img.classList.add('loaded')
      loadedCount++
      if (loadedCount === allImages.length) {
        ensureMinimumHeight() // 🔥 Tüm görseller yüklendiyse çağır
      }
    }
    img.onerror = function () {
      this.onerror = null
      this.src = `https://placehold.co/150x150/f97316/white?text=Hata`
      this.classList.add('loaded')
      loadedCount++
      if (loadedCount === allImages.length) {
        ensureMinimumHeight()
      }
    }
    img.src = img.dataset.src
  })

  // --- PERFORMANS ODAKLI SÜRÜKLEME MANTIĞI ---
  let currentDraggable = null
  let isDragging = false
  let highestZ = 10
  let startTop = 0,
    startLeft = 0
  let startMouseX = 0,
    startMouseY = 0

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

    // --- DEĞİŞİKLİK: DOĞRU SINIR KONTROLÜ ---
    const elHeight = currentDraggable.offsetHeight
    const elWidth = currentDraggable.offsetWidth
    const bodyWidth = document.body.clientWidth
    // scrollHeight yerine offsetHeight kullanarak sayfanın büyümesini engelle
    const boundaryHeight = document.body.offsetHeight

    // Üst sınır
    //   if (newTop < 0) {
    //      newTop = 0;
    //  }
    // Sol sınır
    //    if (newLeft < 0) {
    //       newLeft = 0;
    //   }
    // Alt sınır
    if (newTop + elHeight > boundaryHeight) {
      newTop = boundaryHeight - elHeight
    }
    // Sağ sınır
    //  if (newLeft + elWidth > bodyWidth) {
    //      newLeft = bodyWidth - elWidth;
    //   }
    // --- SINIR KONTROLÜ BİTTİ ---

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

  // Hamburger menu toggle for mobile nav
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileNav = document.getElementById('mobileNav');
  if (hamburgerBtn && mobileNav) {
    hamburgerBtn.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      hamburgerBtn.setAttribute('aria-expanded', mobileNav.classList.contains('open') ? 'true' : 'false');
    });
    // Optional: close menu when a link is clicked
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }
})
