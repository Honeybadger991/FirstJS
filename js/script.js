import calc from './modules/calc';
import cards from './modules/cards';
import forms from './modules/forms';
import modal from './modules/modal';
import slider from './modules/slider';
import tabs from './modules/tabs';
import timer from './modules/timer';
import {showModal} from './modules/modal';

window.addEventListener('DOMContentLoaded', () =>{

    const modalTimer = setTimeout(() => showModal('.modal', modalTimer), 60000);
    calc();
    cards();
    forms('form', modalTimer);
    modal('[data-modal]', '.modal', modalTimer);
    slider({
        container:'.offer__slider',
        slide:'.offer__slide',
        nextArrow:'.offer__slider-next',
        prevArrow:'.offer__slider-prev',
        totalCounter:'#total',
        currentCounter:'#current',
        wrapper:'.offer__slider-wrapper',
        field:'.offer__slider-inner'
    });
    tabs('.tabheader__items', '.tabheader__item', '.tabcontent', 'tabheader__item_active');
    timer('2023-02-30');
})