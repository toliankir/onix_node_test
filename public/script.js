const citynameInput = document.querySelector('#cityname');
const citynameList = document.querySelector('#citylist');


const socket = io.connect({});
socket.on('citylist', (data) => {
    citynameList.innerHTML = '';
    data.forEach(city => {
        citynameList.innerHTML += `<li><span class="citycode">${city.id}</span>
            <span class="cityname">${city.name},</span>
            <span class="citycountry">${city.country}</span></li>`;
    });
    console.log(data);
});

citynameInput.addEventListener('input', (event) => {
    if (!citynameInput.value) {
        return;
    }
    socket.emit('cityname', {name: citynameInput.value});
});

