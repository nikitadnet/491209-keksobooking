'use strict';
var Titles = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];

var Types = [
  'palace',
  'flat',
  'house',
  'bungalo'
];

var Times = [
  '12:00',
  '13:00',
  '14:00'
];

var Features = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];

var Photos = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

var HouseTypes = {
  house: 'Дом',
  palace: 'Дворец',
  flat: 'Квартира',
  bungalo: 'Бунгало'
};

var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;

var map = document.querySelector('.map');
var pinList = document.querySelector('.map__pins');
var filters = document.querySelector('.map__filters-container');
var filtesBlockParent = filters.parentNode;
var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
var adTemplate = document.querySelector('template').content.querySelector('.map__card');
var inputAdress = document.querySelector('#address');
var mainPin = document.querySelector('.map__pin--main');
var mapPinsContainer = document.querySelector('.map__pins');
var adForm = document.querySelector('.ad-form');
var adFormFieldsets = document.querySelectorAll('.ad-form__element');

var getRandomNumber = function (min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

var getShuffleArrayElement = function (array) {
  for (var i = array.length - 1; i > 0; i--) {
    var randomIndex = Math.floor(Math.random() * (i + 1));
    var temporaryValue = array[i];
    array[i] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
};

var getRandomLengthArray = function (array) {
  var newArray = [];

  for (var i = 0; i <= getRandomNumber(1, array.length - 1); i++) {
    newArray.push(array[i]);
  }
  return newArray;
};

var getElementIndex = function (element) {
  var nodes = Array.prototype.slice.call(element.parentNode.children);
  return nodes.indexOf(element);
};


var maxAds = 8;
var minRandomValue = 0;
var minRandomAdressValue = 1;
var maxRandomAdressValue = 1000;
var minRandomPriceValue = 1000;
var maxRandomPriceValue = 1000000;
var minRoomsValue = 1;
var maxRoomsValue = 5;
var minGuestsValue = 1;
var maxGuestsValue = 100;

var minLocationCoordinateX = 300;
var maxLocationCoordinateX = 900;
var minLocationCoordinateY = 130;
var maxLocationCoordinateY = 630;

var createAds = function (titles, types, times, features, photos) {
  var ads = [];
  var ad = {};
  for (var i = 1; i <= maxAds; i++) {
    ad = {
      author: {
        avatar: 'img/avatars/user0' + i + '.png'
      },
      offer: {
        title: titles[getRandomNumber(minRandomValue, titles.length - 1)],
        address: getRandomNumber(minRandomAdressValue, maxRandomAdressValue) + ', ' + getRandomNumber(minRandomAdressValue, maxRandomAdressValue),
        price: getRandomNumber(minRandomPriceValue, maxRandomPriceValue),
        type: types[getRandomNumber(minRandomValue, types.length - 1)],
        rooms: getRandomNumber(minRoomsValue, maxRoomsValue),
        guests: getRandomNumber(minGuestsValue, maxGuestsValue),
        checkin: times[getRandomNumber(minRandomValue, times.length - 1)],
        checkout: times[getRandomNumber(minRandomValue, times.length - 1)],
        features: getRandomLengthArray(features),
        description: '',
        photos: getShuffleArrayElement(photos)
      },
      location: {
        x: getRandomNumber(minLocationCoordinateX, maxLocationCoordinateX),
        y: getRandomNumber(minLocationCoordinateY, maxLocationCoordinateY)
      }
    };
    ads.push(ad);
  }
  return ads;
};

var adsData = createAds(Titles, Types, Times, Features, Photos);

var renderPins = function (ads) {
  var pinFragment = document.createDocumentFragment();

  for (var i = 0; i < ads.length; i++) {
    var pinElement = pinTemplate.cloneNode(true);
    pinElement.style.left = (ads[i].location.x - PIN_WIDTH / 2) + 'px';
    pinElement.style.top = (ads[i].location.y - PIN_HEIGHT) + 'px';
    pinElement.children[0].src = ads[i].author.avatar;
    pinElement.children[0].alt = ads[i].offer.title;
    pinFragment.appendChild(pinElement);
  }
  pinList.appendChild(pinFragment);
};

var renderAd = function (ad) {
  var adElement = adTemplate.cloneNode(true);

  adElement.querySelector('.popup__title').textContent = ad.offer.title;
  adElement.querySelector('.popup__text--address').textContent = ad.offer.address;
  adElement.querySelector('.popup__text--price').textContent = ad.offer.price + '₽/ночь';
  adElement.querySelector('.popup__type').textContent = HouseTypes[ad.offer.type];
  adElement.querySelector('.popup__text--capacity').textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
  adElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;

  var featuresBlock = adElement.querySelector('.popup__features');
  featuresBlock.innerHTML = '';
  for (var j = 0; j < ad.offer.features.length; j++) {
    featuresBlock.innerHTML += '<li class="popup__feature popup__feature--' + ad.offer.features[j] + '"></li>';
  }

  adElement.querySelector('.popup__description').textContent = ad.offer.description;

  var photos = adElement.querySelector('.popup__photos');
  var photoTemplate = photos.querySelector('.popup__photo');
  photos.removeChild(photoTemplate);
  for (var i = 0; i < ad.offer.photos.length; i++) {
    var photoElement = photoTemplate.cloneNode(true);
    photoElement.src = ad.offer.photos[i];
    photos.appendChild(photoElement);
  }

  adElement.querySelector('.popup__avatar').src = ad.author.avatar;

  return adElement;
};

var adressHandler = function () {
  var coordinateX = parseInt(mainPin.style.left, 10) + Math.round(mainPin.offsetWidth / 2);
  var coordinateY = parseInt(mainPin.style.top, 10) + Math.round(mainPin.offsetHeight / 2);
  inputAdress.value = coordinateX + ',' + coordinateY;
};

var activePageHandler = function () {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
};

var deactivationForm = function () {
  for (var i = 0; i < adFormFieldsets.length; i++) {
    var fieldset = adFormFieldsets[i];
    fieldset.setAttribute('disabled', 'disabled');
  }
};

deactivationForm();

var activateForm = function () {
  for (var i = 0; i < adFormFieldsets.length; i++) {
    var fieldset = adFormFieldsets[i];
    fieldset.removeAttribute('disabled');
  }
};

mainPin.addEventListener('mouseup', function () {
  activePageHandler();
  adressHandler();
  renderPins(adsData);
  activateForm();
});

var deleteCard = function () {
  var сard = map.querySelector('.map__card');
  if (сard) {
    map.removeChild(сard);
  }
};

var excessElementsAmount = 2;

mapPinsContainer.addEventListener('click', function (evt) {
  var target = evt.target;
  var mapPin = target.closest('.map__pin');
  var index = getElementIndex(mapPin) - excessElementsAmount;

  if (evt.target.classList.contains('map__pin--main')) {
    return;
  }
  filtesBlockParent.insertBefore(renderAd(adsData[index]), filters);

  var popupCloseButton = map.querySelector('.popup__close');
  popupCloseButton.addEventListener('click', function () {
    deleteCard();
  });
});


