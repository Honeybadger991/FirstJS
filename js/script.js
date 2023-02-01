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


    class Card {
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

        placeCard(){
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
    }

    const test = new Card(
        'img/tabs/vegy.jpg',
        'vegy', 
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!', 
        9, 
        '.menu__field .container',
        'menu__item'
        );
    test.placeCard();

    const test2 = new Card(
        'img/tabs/elite.jpg',
        'elite', 
        'Меню “Премиум”',
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!', 
        9, 
        '.menu__field .container',
        'menu__item'
        );

    test2.placeCard();

    const test3 = new Card(
        'img/tabs/post.jpg',
        'post', 
        'Меню "Постное"',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.', 
        9, 
        '.menu__field .container',
        'menu__item'
        );
    test3.placeCard();


    //form///////////////////////////////////////////////////////////////////////////////////////////////////

    const forms = document.querySelectorAll('form');

    const massages = {
        loading: 'img/spinner/spinner.svg',
        success:'Спасибо! Мы свяжемся с вами в ближайшее время',
        fail:'Что-то пошло не так...'
    }

    forms.forEach(item =>{
        postForm(item);
    })

    function postForm (form){
        form.addEventListener('submit', (e) =>{
            e.preventDefault();


        const statusMassage = document.createElement('img');
        statusMassage.src = massages.loading;
        statusMassage.style.cssText = `
            display: block;
            margin: 0 auto;
        `;
        form.insertAdjacentElement('afterend', statusMassage)


        const request = new XMLHttpRequest();
        request.open('POST', 'server.php');

        const formData = new FormData(form);
        request.send(formData);

        request.addEventListener('load', () =>{
            if (request.status === 200){
                showThanksModal(massages.success);
                console.log(request.response);
                form.reset();
                statusMassage.remove();
            } else{
                showThanksModal(massages.fail);
            };
        })
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
    
})