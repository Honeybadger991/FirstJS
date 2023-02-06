import {showModal, hideModal } from "./modal";
import { postData } from "../services/services";

function forms(formSelector, modalTimer){
    //form//

    const forms = document.querySelectorAll(formSelector);

    const massages = {
        loading: 'img/spinner/spinner.svg',
        success:'Спасибо! Мы свяжемся с вами в ближайшее время',
        fail:'Что-то пошло не так...'
    }

    forms.forEach(item =>{
        bindPostData(item);
    })

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

    function showThanksModal(message){
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        showModal('.modal', modalTimer);

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
            hideModal('.modal');
        }, 4000);
    }
}

export default forms;