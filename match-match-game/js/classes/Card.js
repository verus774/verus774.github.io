export default class {
    constructor(frontSide, backSide) {
        this.frontSide = frontSide;
        this.backSide = backSide;
    }

    createCard() {
        const BACK_IMG_DIR = './img/back';
        const FRONT_IMG_DIR = './img/front/christmas';

        const cardContainer = document.createElement('div');
        cardContainer.classList.add('card-container');

        const card = document.createElement('figure');
        card.classList.add('card');

        const backImg = document.createElement('img');
        backImg.classList.add('back');
        backImg.setAttribute('src', `${BACK_IMG_DIR}/${this.backSide}.jpg`);

        const frontImg = document.createElement('img');
        frontImg.classList.add('front');
        frontImg.setAttribute('src', `${FRONT_IMG_DIR}/${this.frontSide}.jpg`);

        cardContainer.appendChild(card);
        card.appendChild(backImg);
        card.appendChild(frontImg);

        return cardContainer;
    }

}
