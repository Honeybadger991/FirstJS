function showModal(modalSelector, modalTimer){
    const modalContent = document.querySelector(modalSelector);
    modalContent.classList.add('show');
    modalContent.classList.remove('hide');
    document.body.style.overflow = 'hidden';

    if(modalTimer){
        clearInterval(modalTimer);
    }   
}

function hideModal(modalSelector){
    const modalContent = document.querySelector(modalSelector);
    modalContent.classList.remove('show');
    modalContent.classList.add('hide');
    document.body.style.overflow = ''
}

function modal(triggerSelector, modalSelector, modalTimer){

    const modalOpen = document.querySelectorAll(triggerSelector),
    modalContent = document.querySelector(modalSelector);


    function showModalByScroll (){
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight){
            modalContent.classList.add('show');
            modalContent.classList.remove('hide');
            document.body.style.overflow = 'hidden';
            clearInterval(modalTimer);
            window.removeEventListener('scroll', showModalByScroll)
        }
    }

    modalOpen.forEach(btn =>{
        btn.addEventListener('click', () => showModal(modalSelector, modalTimer))
    });

    modalContent.addEventListener('click', (e) =>{
        if (e.target === modalContent || e.target.getAttribute('data-close') == ''){
            hideModal(modalSelector);
        }
    });

    document.addEventListener('keydown', (e) =>{
        if(e.code === 'Escape' && modalContent.classList.contains('show')){
            hideModal(modalSelector);
        }
    })

    window.addEventListener('scroll', showModalByScroll);

}

export default modal;
export {showModal};
export {hideModal};