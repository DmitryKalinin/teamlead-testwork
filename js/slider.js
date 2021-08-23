class Slider {
    constructor(parent) {
            this.container = parent.querySelector('.slider-container');
            this.track = parent.querySelector('.slider-track');
            this.items = parent.querySelectorAll('.slider-item');
            this.prev = parent.querySelector('.btn-prev');
            this.next = parent.querySelector('.btn-next');
            this.progress = parent.querySelector('.slider-progress');
            this.progressLine = parent.querySelector('.slider-progress-current');
            this.titles = parent.querySelectorAll('.slider-item-title');


            this.widthItem = this.items[0] && this.items[0].clientWidth + 2; //+2 - это border у .slider-item
            this.position = 0; // Номер элемента, стоящего на первой позиции
            this.slidesToShow = this.getSlideToShow(); // количество отобрахаемых плиток
            this.maxPosition = this.items.length - this.slidesToShow; //номер последнего элемента, который может быть на первой позиции
            this.progressLine.style.width = `${this.progress.clientWidth / (this.maxPosition+1)}px`; //ширина для прогресс-бара

            this.prev.addEventListener('click', () => this.handlePrevClick()); //обработчики кнопок
            this.next.addEventListener('click', () => this.handleNextClick());
            window.addEventListener("resize", () => { //изменение количества плиток при масштабировании экрана
                this.slidesToShow = this.getSlideToShow();
                this.setPosition();
            })

            this.sliderTimeOut(3);
            this.dragAndDrop();
            this.setPosition();
            this.titleHeight();
            this.checkBtns();
        }
        //Количество показываемых элементов, зависит от размера окна
    getSlideToShow() {
            //return this.container.clientWidth >= 1200 ? 4 : Math.floor(this.container.clientWidth / this.widthItem)
            return 1
        }
        //Выравнивание ширины заголовков элементов
    titleHeight() {
        let max = 0;
        this.titles.forEach(item => max = item.clientHeight > max ? item.clientHeight : max)
        this.titles.forEach((item) => { item.style.height = `${max}px` })
    }


    //Обработчик вызова предыдущего элемента
    handlePrevClick() {
            this.position--;
            if (this.position < 0) {
                this.position = 0;
            }
            this.setPosition('prev');
            this.checkBtns();
        }
        //Обработчик вызова следующего элемента
    handleNextClick() {
            this.position++;
            if (this.position > this.maxPosition) {
                this.position = this.maxPosition;
            }
            this.setPosition('next');
            this.checkBtns();
        }
        //Функция отрисовки перехода слайдера и прогресс-бара
    setPosition(action) {
            this.track.style.transition = '0.5s';
            if (action === 'next') {
                this.positionPixel += -(this.widthItem + 40);
                this.track.style.transform += `translateX(${-(this.widthItem+40)}px)`
            }
            if (action === 'prev') {
                this.positionPixel += (this.widthItem + 40);
                this.track.style.transform += `translateX(${(this.widthItem+40)}px)`
            }
            this.progressLine.style.left = `${this.progress.getBoundingClientRect().x + this.position * this.progressLine.clientWidth}px`;
        }
        //Прокрутка слайдера по таймеру
    sliderTimeOut(sec) {
            let flag = 'next';
            let hover = false;
            this.container.addEventListener('mouseover', () => { hover = true })
            this.container.addEventListener('mouseout', () => { hover = false })
            const interval = setInterval(() => {
                if (!hover) {
                    if (this.position <= 0) flag = 'next';
                    if (this.position >= this.maxPosition) flag = 'prev';
                    if (flag === 'next') this.handleNextClick();
                    if (flag === 'prev') this.handlePrevClick();
                }
            }, sec * 1000)
        }
        //Прокрутка слайдера с помощью мыши
    dragAndDrop() {
            let startPosition;
            this.track.addEventListener("touchstart", (e) => {
                startPosition = e.clientX;
                document.addEventListener("touchmove", moveTrack);
                document.addEventListener("touchend", (e) => {
                    document.removeEventListener("touchmove", moveTrack);

                })
            });
            this.track.addEventListener("mousedown", (e) => {
                startPosition = e.clientX;
                document.addEventListener("mousemove", moveTrack);
                document.addEventListener("mouseup", (e) => {
                    document.removeEventListener("mousemove", moveTrack);

                })
            });
            const moveTrack = (e) => {
                if (startPosition - e.clientX > 50 && this.position < this.maxPosition) {
                    document.removeEventListener("mousemove", moveTrack);
                    document.removeEventListener("touchmove", moveTrack);
                    this.handleNextClick();
                }
                if (e.clientX - startPosition > 50 && this.position > 0) {
                    document.removeEventListener("mousemove", moveTrack);
                    document.removeEventListener("touchmove", moveTrack);
                    this.handlePrevClick();
                }
            }
        }
        //Установка активности кнопок
    checkBtns() {
        this.prev.disabled = this.position <= 0;
        this.next.disabled = this.position >= this.maxPosition;
    }
}
new Slider(document.querySelector('.slider'));