function cards(){
    //class-cards//

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


    axios.get('http://localhost:3000/menu')
        .then(data => {
        data.data.forEach(({img, altimg, title, descr, price}) =>{
            new MenuCard(img, altimg, title, descr, price, '.menu__field .container').placeMenuCard();
            });
        });
}

export default cards;