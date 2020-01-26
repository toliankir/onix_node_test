const citynameInput = document.querySelector('#cityname');
const citynameList = document.querySelector('#citylist');
const forecatForm = document.querySelector('#forecast');

const socket = io.connect({});
socket.on('citylist', (data) => {
    citynameList.innerHTML = ''
    citynameList.style.display = 'block';

    if (data.length === 0) {
        citynameList.innerHTML = '<li><span class="cityname">No cities found</span></li>';
        return;
    }

    data.forEach(city => {
        const listElement = document.createElement('li');
        listElement.innerHTML = `<span class="citycode">${city.id}</span>
        <span class="cityname">${city.name},</span>
        <span class="citycountry">${city.country}</span>`;
        listElement.addEventListener('click', () => {
            citynameInput.value = city.name;
        });
        citynameList.appendChild(listElement);
    });
});

citynameInput.addEventListener('input', (event) => {
    if (!citynameInput.value) {
        return;
    }
    if (citynameInput.value.length < 4) {
        citynameList.innerHTML = '';
        citynameList.style.display = 'none';
    }    
    socket.emit('cityname', {name: citynameInput.value});
});

forecatForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    window.location = `${window.location.origin}/forecast/${citynameInput.value}`;
});
