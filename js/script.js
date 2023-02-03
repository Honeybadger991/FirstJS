window.addEventListener('DOMContentLoaded', () =>{

    //tabs///////////////////////////////////////////////////////////////////////////////////////////////////
    const tabsParent = document.querySelector('.tabheader__items'),
          tabs = document.querySelectorAll('.tabheader__item'),
          tabsContent = document.querySelectorAll('.tabcontent');

    function hideTabsContent(){
        tabsContent.forEach(item =>{
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item =>{
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabsContent(i = 0){
        tabsContent[i].classList.remove('hide');
        tabsContent[i].classList.add('show', 'fade');
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabsContent()
    showTabsContent()

    tabsParent.addEventListener('click', event =>{
        const target = event.target;

        if (target && target.classList.contains('tabheader__item')){
            tabs.forEach((item, i) =>{
                if(item == target){
                    hideTabsContent()
                    showTabsContent(i);
                }
            })
        }
    })

    //slider///////////////////////////////////////////////////////////////////////////////////////////////////

    const sliderParent = document.querySelector('.offer__slider-counter'),
          sliderPrev = sliderParent.querySelector('.offer__slider-prev'),
          sliderNext = sliderParent.querySelector('.offer__slider-next'),
          slideCurrentNumber = sliderParent.querySelector('#current'),
          slideTotalNumber = sliderParent.querySelector('#total'),
          slideContent = document.querySelectorAll('.offer__slide');


    let num = 0;
    
    sliderParent.addEventListener('click', event =>{
        const target = event.target;
        if (target && target == sliderNext){
            if(num >= slideContent.length - 1){
                num = -1;
            }
            num++;
        }
        if (target && target == sliderPrev){
            if(num <= 0){
                num = slideContent.length;
            }
            num--;
        }
        detectSlideCurrentNumber(num);
        detectSlideTotalNumber();
        showSlideContent(num);
    });

    function detectSlideTotalNumber (){
        const leng = slideContent.length;
        if (leng <= 9){
            slideTotalNumber.textContent = `0${leng}`;
        } else slideTotalNumber.textContent = `${leng}`;
    };


    function detectSlideCurrentNumber (i){
        if (i <= 8){
            slideCurrentNumber.textContent = `0${i + 1}`
        }
        else slideCurrentNumber.textContent = `${i + 1}`;
    };


    function showSlideContent(i){
        slideContent.forEach(item =>{
            item.classList.add('hide');
            item.classList.remove('show');
        });
        slideContent[i].classList.remove('hide');
        slideContent[i].classList.add('show');
    };


    detectSlideCurrentNumber(num);
    detectSlideTotalNumber();
    showSlideContent(num);


    //timer///////////////////////////////////////////////////////////////////////////////////////////////////

    const deadline = '2023-02-30';

    function getTimeRemaining(endTime){
        const t = Date.parse(endTime) - Date.parse(new Date()),
            days = Math.floor(t / (1000 * 60 * 60 *24)),
            hours = Math.floor(t / (1000 * 60 * 60) % 24),
            minutes = Math.floor((t / 1000 / 60) % 60),
            seconds = Math.floor((t / 1000) % 60);

        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }
    
    function setZero(num){
        if (num >= 0 && num < 10){
            return `0${num}`
        } else return num
    }

    function setClock(endTime){
        const timer = document.querySelector('.timer'),
              days = timer.querySelector("#days"),
              hours = timer.querySelector("#hours"),
              minutes = timer.querySelector("#minutes"),
              seconds = timer.querySelector("#seconds"),
              timeInterval = setInterval(updateClock, 1000);

        updateClock();
        
        function updateClock(){
            const t = getTimeRemaining(endTime);

            days.innerHTML = setZero(t.days);
            hours.innerHTML = setZero(t.hours);
            minutes.innerHTML = setZero(t.minutes);
            seconds.innerHTML = setZero(t.seconds);

            if (t.total <= 0){
                clearInterval(timeInterval);
                days.innerHTML = 0;
                hours.innerHTML = 0;
                minutes.innerHTML = 0;
                seconds.innerHTML = 0;
            }
        }
    }   

    setClock(deadline)

    

    //class-cards///////////////////////////////////////////////////////////////////////////////////////////////////


    class MenuCard {
        constructor(imgSrc, imgAlt, subtitle, descr, price, parentSelector, ...classes){
            this.imgSrc = imgSrc;
            this.imgAlt = imgAlt;
            this.subtitle = subtitle;
            this.descr = descr;
            this.price = price;
            this.parent = document.querySelector(parentSelector);
            this.classes = classes;
            this.transfer = 27;
            this.convertToUAH();
        }

        convertToUAH(){
            this.price = this.price * this.transfer;
        }

        placeMenuCard(){
            const div = document.createElement('div');

            if (this.classes.length === 0){
                this.classes = 'menu__item';
                div.classList.add(this.classes);
            } else{
                this.classes.forEach(className => div.classList.add(className));
            }

            
            div.innerHTML = `
            <img src=${this.imgSrc} alt=${this.imgAlt}>
            <h3 class="menu__item-subtitle">${this.subtitle}</h3>
            <div class="menu__item-descr">${this.descr}</div>
            <div class="menu__item-divider"></div>
            <div class="menu__item-price">
                <div class="menu__item-cost">Цена:</div>
                <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
            </div>
            `;
            this.parent.append(div);
        }
    };

    const getResource = async (url) =>{
        const res = await fetch(url);

        if(!res.ok){
            throw new Error(`could not fetch ${url}, status: ${res.status}`)
        }

        return await res.json();
    };

    // getResource('http://localhost:3000/menu')
    //     .then(data => {
    //         data.forEach(({img, altimg, title, descr, price}) =>{
    //             new MenuCard(img, altimg, title, descr, price, '.menu__field .container').placeMenuCard();
    //         });
    //     });

    axios.get('http://localhost:3000/menu')
        .then(data => {
        data.data.forEach(({img, altimg, title, descr, price}) =>{
            new MenuCard(img, altimg, title, descr, price, '.menu__field .container').placeMenuCard();
            });
        });

    //form///////////////////////////////////////////////////////////////////////////////////////////////////

    const forms = document.querySelectorAll('form');

    const massages = {
        loading: 'img/spinner/spinner.svg',
        success:'Спасибо! Мы свяжемся с вами в ближайшее время',
        fail:'Что-то пошло не так...'
    }

    forms.forEach(item =>{
        bindPostData(item);
    })

    const postData = async (url, data) =>{
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });

        return await res.json();
    }


    function bindPostData (form){
        form.addEventListener('submit', (e) =>{
            e.preventDefault();


        const statusMassage = document.createElement('img');
        statusMassage.src = massages.loading;
        statusMassage.style.cssText = `
            display: block;
            margin: 0 auto;
        `;
        form.insertAdjacentElement('afterend', statusMassage);

        const formData = new FormData(form);

        const json = JSON.stringify(Object.fromEntries(formData.entries()));

        postData('http://localhost:3000/requests', json)
        .then(data =>{
            console.log(data);
            showThanksModal(massages.success);
            statusMassage.remove();
        }).catch(() =>{
            showThanksModal(massages.fail);
        }).finally(() =>{
            form.reset();
        });
        })
    }


    //modal///////////////////////////////////////////////////////////////////////////////////////////////////

    const modalOpen = document.querySelectorAll('[data-modal]'),
    modalContent = document.querySelector('.modal');


    function showModal(){
        modalContent.classList.add('show');
        modalContent.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimer);
    }

    function hideModal(){
        modalContent.classList.remove('show');
        modalContent.classList.add('hide');
        document.body.style.overflow = ''
    }

    function showModalByScroll (){
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight){
            modalContent.classList.add('show');
            modalContent.classList.remove('hide');
            document.body.style.overflow = 'hidden';
            clearInterval(modalTimer);
            window.removeEventListener('scroll', showModalByScroll)
        }
    }

    const modalTimer = setTimeout(showModal, 60000);

    modalOpen.forEach(btn =>{
        btn.addEventListener('click', showModal)
    });

    modalContent.addEventListener('click', (e) =>{
        if (e.target === modalContent || e.target.getAttribute('data-close') == ''){
            hideModal();
        }
    });

    document.addEventListener('keydown', (e) =>{
        if(e.code === 'Escape' && modalContent.classList.contains('show')){
            hideModal();
        }
    })

    window.addEventListener('scroll', showModalByScroll);

    //modal_2///////////////////////////////////////////////////////////////////////////////////////////////////

    function showThanksModal(message){
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        showModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content"> 
                <div class="modal__close" data-close>×</div>
                <div class="modal__title">${message}</div>
            </div>
        `;

        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            hideModal();
        }, 4000);
    }
    
    // fetch('http://localhost:3000/menu')
    //     .then(data => data.json())
    //     .then(res => console.log (res))
})