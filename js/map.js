'use strict';
var TITLES = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];

var TYPES = [
  'palace',
  'flat',
  'house',
  'bungalo'
];

var TIMES = [
  '12:00',
  '13:00',
  '14:00'
];

var FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];

var AD_PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

var HOUSE_TYPES = {
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

var getRandomlengthArray = function (array) {
  var newArray = [];

  for (var i = 0; i <= getRandomNumber(1, array.length - 1); i++) {
    newArray.push(array[i]);
  }
  return newArray;
};

var createAds = function (titles, types, times, features, photos) {
  var ads = [];
  var ad = {};
  var maxCount = 8;

  for (var i = 1; i <= maxCount; i++) {
    ad = {
      author: {
        avatar: 'img/avatars/user0' + i + '.png'
      },
      offer: {
        title: titles[getRandomNumber(0, titles.length - 1)],
        address: getRandomNumber(1, 1000) + ', ' + getRandomNumber(1, 1000),
        price: getRandomNumber(1000, 1000000),
        type: types[getRandomNumber(0, types.length - 1)],
        rooms: getRandomNumber(1, 5),
        guests: getRandomNumber(1, 100),
        checkin: times[getRandomNumber(0, times.length - 1)],
        checkout: times[getRandomNumber(0, times.length - 1)],
        features: getRandomlengthArray(features),
        description: '',
        photos: getShuffleArrayElement(photos)
      },
      location: {
        x: getRandomNumber(300, 900),
        y: getRandomNumber(130, 630)
      }
    };
    ads.push(ad);
  }
  return ads;
};

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
  adElement.querySelector('.popup__type').textContent = HOUSE_TYPES[ad.offer.type];
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

var ads = createAds(TITLES, TYPES, TIMES, FEATURES, AD_PHOTOS);
renderPins(ads);
var initialAdElementIndex = 0;
filtesBlockParent.insertBefore(renderAd(ads[initialAdElementIndex]), filters);
map.classList.remove('map--faded');
