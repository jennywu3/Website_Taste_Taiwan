let menu = document.querySelector('#menu-bar')
let navbar = document.querySelector('.navbar')

// 按下按鈕之後產生的變化
menu.onclick = () => {
    menu.classList.toggle('fa-times');
    navbar.classList.toggle('active');
}

window.addEventListener("scroll", function () {
    const intro = document.querySelector('.intro');
    const left = document.querySelector('.intro .left');
    const content = document.querySelector('.intro .content');

    const introPosition = intro.getBoundingClientRect().top;
    const introHeight = intro.getBoundingClientRect().height;
    const windowHeight = window.innerHeight;

    // 進入視窗80%的區域，且元素的底部仍然在視窗內
    if (introPosition < windowHeight * 0.8 && introPosition + introHeight > 0) {
        left.classList.add('show');
        content.classList.add('show');
    } else {
        left.classList.remove('show');
        content.classList.remove('show');
    }

    const category = document.querySelector('.category');
    const catebox = document.querySelector('.category .box-container');
    const catePosition = category.getBoundingClientRect().top;
    const cateHeight = category.getBoundingClientRect().height;

    if (catePosition < windowHeight * 0.8 && catePosition + cateHeight > 0) {
        catebox.classList.add('show');
    } else {
        catebox.classList.remove('show');
    }

    const detail = document.querySelector('.detail .box-container');
    const detailPosition = detail.getBoundingClientRect().top;
    const detailHeight = detail.getBoundingClientRect().height;
    if (detailPosition < windowHeight * 0.8  && detailPosition + detailHeight > 0) {
        detail.classList.add('show');
    } else {
        detail.classList.remove('show'); 
    }

    const game = document.querySelector('.game .card-container');
    const gamePosition = game.getBoundingClientRect().top;
    const gameHeight = game.getBoundingClientRect().height;
    if (gamePosition < windowHeight * 0.8 && gamePosition + gameHeight > 0) {
        game.classList.add('show');
    } else {
        game.classList.remove('show'); 
    }

});


let foodData = [];
let filteredData = [];

const boxContainer = document.querySelector('.detail .box-container');
const filterBtns = document.querySelectorAll('.detail .filter-btn');
const pagination = document.querySelector('.detail .pagination');
const itemsPerPage = 8;
let currentPage = 1;
let activeCategories = [];

window.onload = function () {
    getData('all');
};

// 初次加載數據
function getData() {
    fetch('data/data.json')
        .then(response => response.json())
        .then(data => {
            foodData = data;
            // showRandomItems(foodData);
            filteredData = shuffleArray([...foodData]);
            renderData(filteredData); // food detail
            generatePhotoCards();   // food game
        })
        .catch(error => console.error('Error loading JSON:', error));
}

// random show the item at first time
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


// 篩選數據
function filterData(category) {
    if (category === 'all') {
        filteredData = foodData;
    } else {
        filteredData = foodData.filter(item => item.category === category);  // 篩選對應類別
    }
    currentPage = 1; // 重置頁碼
    renderData(filteredData);
}

// 篩選數據（
filterBtns.forEach(button => {
    button.addEventListener('click', function () {
        const category = this.getAttribute('data-category');

        this.classList.toggle('active');
        if (this.classList.contains('active')) {
            activeCategories.push(category);
        } else {
            activeCategories = activeCategories.filter(cat => cat !== category);
        }

        if (activeCategories.length === 0) {
            filteredData = shuffleArray([...foodData]);
        } else {
            filteredData = foodData.filter(item => activeCategories.includes(item.category));
        }

        currentPage = 1;
        renderData(filteredData);
    });
});


function renderData(data) {
    boxContainer.innerHTML = '';

    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const currentPageData = data.slice(startIdx, endIdx);

    currentPageData.forEach(item => {
        const box = document.createElement('div');
        box.classList.add('box');
        box.innerHTML = `
            <img src="${item.image}" alt="">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
        `;
        boxContainer.appendChild(box);
    });

    const totalPages = Math.ceil(data.length / itemsPerPage);
    renderPagination(totalPages);
}


// 為篩選按鈕添加點擊事件
document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', function () {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');

        const category = this.getAttribute('data-category');
        filterData(category);
    });
});


function renderPagination(totalPages) {
    pagination.innerHTML = '';

    // Prev button
    const prevBtn = document.createElement('button');
    prevBtn.classList.add('prev-btn');
    prevBtn.innerText = '<';
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderData(filteredData);
        }
    });
    pagination.appendChild(prevBtn);

    // Page button
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.classList.add('page-number');
        pageBtn.innerText = i;
        if (i === currentPage) {
            pageBtn.classList.add('active');
        }
        pageBtn.addEventListener('click', () => {
            currentPage = i;
            renderData(filteredData);
        });
        pagination.appendChild(pageBtn);
    }

    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.classList.add('next-btn');
    nextBtn.innerText = '>';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderData(filteredData);
        }
    });
    pagination.appendChild(nextBtn);

    pagination.style.display = totalPages > 1 ? 'block' : 'none';
}



const modal = document.getElementById('modal');
const closeBtn = document.getElementById('close-btn');

boxContainer.addEventListener('click', (event) => {
    if (event.target.closest('.box')) {
        const box = event.target.closest('.box');

        const imageSrc = box.querySelector('img').src;
        const title = box.querySelector('h3').innerText;
        const description = box.querySelector('p').innerText;

        const modal = document.getElementById('modal');
        const modalBody = document.querySelector('.modal-body');

        modalBody.innerHTML = `
            <img src="${imageSrc}" alt="">
            <h3>${title}</h3>
            <p>${description}</p>
        `;

        modal.style.display = 'flex';
    }
});

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

// 外部區域也可以關閉
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

const categoryOptions = document.querySelectorAll(".category-option");
const flipButton = document.getElementById("flip-button");
const photoContainer = document.getElementById("card-container");

let selectedCategories = ["traditional"];  // default value

generatePhotoCards();

// change options
categoryOptions.forEach(option => {
    option.addEventListener("click", () => {
        option.classList.toggle("selected");
        // console.log(option)
        const category = option.getAttribute("data-category");

        if (option.classList.contains("selected")) {
            if (!selectedCategories.includes(category)) {
                selectedCategories.push(category);
            }
        } else {
            selectedCategories = selectedCategories.filter(item => item !== category);
        }

        generatePhotoCards();
        flipButton.disabled = selectedCategories.length === 0;
    });
});

function generatePhotoCards() {
    photoContainer.innerHTML = "";

    selectedCategories.forEach((category) => {
        const photoCard = document.createElement("div");
        photoCard.classList.add("photo-card");

        photoCard.innerHTML = `
              <div class="card-front">
                <img src="" alt="">
                <h3>?</h3>
                <p>?</p>
               </div>
               <div class="card-back"></div> 
        `;

        photoContainer.appendChild(photoCard);
    });
}

// 翻牌按鈕
flipButton.addEventListener("click", () => {
    const photoCards = document.querySelectorAll(".game .card-container .photo-card");
    const allFlipped = Array.from(photoCards).every(card => card.classList.contains("flipped"));

    if (allFlipped) {
        photoCards.forEach(card => {
            card.style.transform = "rotateY(0deg)";
            card.classList.remove("flipped");
        });
    } else {
        photoCards.forEach((card, index) => {
            const category = selectedCategories[index];
            const filteredData = foodData.filter(item => item.category === category);

            const randomFood = filteredData[Math.floor(Math.random() * filteredData.length)];
            const cardFront = card.querySelector(".card-front");
            cardFront.innerHTML = `
                <img src="${randomFood.image}" alt="">
                <h3>${randomFood.name}</h3>
            `;
            card.classList.add("flipped");
            card.style.transform = "rotateY(180deg)";
        });

    }
});

