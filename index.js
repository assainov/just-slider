module.exports = (options) => {
    if (!options.container) {
        throw new Error ('Kiss slider: container option is neccessary');
    }

    const container = options.container,
        slideItems = Array.from(container.children),
        slideWidth = container.offsetWidth,
        autoplaySpeed = options.autoplaySpeed || 2000,
        rtl = typeof options.rtl == 'boolean' && options.rtl === true,
        autoplay = typeof options.autoplay == 'boolean' && options.autoplay === true,
        infinite = typeof options.infinite == 'boolean' && options.infinite === true;

    let slidesCount = actualSlidesCount = slideItems.length;
    if (infinite) {
        slidesCount = slideItems.length + 2;
    }

    let defaultDirection = 'right';
    if (rtl) {
        defaultDirection = 'left';
    }

    const infiniteOffset = infinite ? 0 : 1;
    let initialSlide = options.initialSlide ? options.initialSlide - 1 - infiniteOffset : 0 - infiniteOffset;
    if (options.initialSlide > actualSlidesCount) {
        initialSlide = actualSlidesCount - 1 - infiniteOffset;
    }

    if (rtl) {
        initialSlide = options.initialSlide ? actualSlidesCount - options.initialSlide - infiniteOffset  : actualSlidesCount - 1 - infiniteOffset;
        if (options.initialSlide > actualSlidesCount) {
            initialSlide = 0 - infiniteOffset;
        }
    }

    if (autoplay) {
        enableAutoplay();
    }

    container.classList.add('kiss-slider');
    container.setAttribute('dir', 'ltr');

    const slideFrame = document.createElement('div');
    slideFrame.classList.add('kiss-slider-frame');
    slideFrame.style.cssText = `
        width: ${slideWidth}px;
    `;
    container.appendChild(slideFrame);

    const slideList = document.createElement('div');
    slideList.classList.add('kiss-slider-list');
    slideList.style.cssText = `
        width: ${slideWidth * slidesCount}px;
    `;
    slideFrame.appendChild(slideList);

    slideItems.forEach(function(item) {
        container.removeChild(item);
        const slideContainer = document.createElement('div');
        slideContainer.classList.add('kiss-slide-container');
        slideContainer.style.cssText = `
            width: ${slideWidth}px;
        `;

        if (rtl) {
            slideList.insertBefore(slideContainer, slideList.firstChild);
        } else {
            slideList.appendChild(slideContainer);
        }
        
        if (item.style.display == 'inline') {
            item.style.display = 'block';
        }
        
        item.style.width = '100%';
        slideContainer.appendChild(item);
    })
    
    const leftBtn = document.createElement('button');
    leftBtn.classList.add('kiss-slider-btn', 'kiss-slider-btn-left');
    leftBtn.textContent = 'Left';
    container.appendChild(leftBtn);

    const rightBtn = document.createElement('button');
    rightBtn.classList.add('kiss-slider-btn', 'kiss-slider-btn-right');
    rightBtn.textContent = 'Right';
    container.appendChild(rightBtn);

    if (infinite) {
        cloneFirstAndLast();
    }

    setSlide(initialSlide + 1);

    leftBtn.addEventListener('click', slide.bind(this, 'left'));
    rightBtn.addEventListener('click', slide.bind(this, 'right'));

    let currentlySliding = false;
    function slide(direction) {
        currentlySliding = true;
        const currentSlide = getCurrentSlide();
        
        let nextSlide = direction == 'right' ? currentSlide + 1 : currentSlide - 1;

        if (currentSlide == 0 && direction == 'left') {
            return;
        } else if (currentSlide == slidesCount - 1 && direction == 'right') {
            return;
        }

        setSlide(nextSlide);

        setTimeout(() => {
            currentlySliding = false;
        }, autoplaySpeed);
    }

    function setSlide(num) {
        slideList.style.transform = `translateX(-${num * slideWidth}px)`
    
        if (infinite) {
            setTimeout(() => {
                if (num == slidesCount - 1) {
                    slideList.style.transition = 'none';
                    slideList.style.transform = `translateX(-${slideWidth * 1}px)`;
                    setTimeout(() => {
                        slideList.style.transition = 'transform ease-in-out 0.5s';
                    }, 50)
                }
                if (num == 0) {
                    slideList.style.transition = 'none';
                    slideList.style.transform = `translateX(-${slideWidth * (slidesCount - 2)}px)`;
                    setTimeout(() => {
                        slideList.style.transition = 'transform ease-in-out 0.5s';
                    }, 50)
                }
            }, 550);
        }
    }
    function getCurrentSlide() {
        const transformVal = slideList.style.transform;
        const x = transformVal.match(/\d+/);
        return Math.round(x / slideWidth);
    }
    function enableAutoplay() {
        setInterval(playSlide, autoplaySpeed);
    }
    function playSlide() {
        if (!currentlySliding) {
            slide(defaultDirection);
        }
    }
    function cloneFirstAndLast() {
        const firstClone = slideList.firstChild.cloneNode(true),
            lastClone = slideList.lastChild.cloneNode(true);

        slideList.appendChild(firstClone);
        slideList.insertBefore(lastClone, slideList.firstChild);
    }
}