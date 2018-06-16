'use strict';
var TITLES_LIST = [
  'Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец',
  'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'
];
var TYPES_LIST = ['palace', 'flat', 'house', 'bungalo'];
var times = ['12:00', '13:00', '14:00'];
var features = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var photosList = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

var getRandomIndex = function (values) {
  var rand = Math.floor(Math.random() * values.length);
  return rand;
};

var showElements = function (element) {
  element.classList.remove('hidden');
};

var getRandomNumber = function (min, max) {
  var randomNumber = min + Math.random() * (max + 1 - min);
  randomNumber = Math.floor(randomNumber);
  return randomNumber;
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

var getRandomValueInArray = function (array) {
  var newArray = [];

  for (var i = 1; i <= getRandomNumber(1, array.length - 1); i++) {
    newArray.push(array[i]);
  }
  return newArray;
};

var getMapArray = function () {
  var array = [];
  var obj = {};
  var maxCount = 8;

  for (var i = 1; i <= maxCount; i++) {
    obj = {
      author: {
        avatar: 'img/avatars/user0' + getRandomNumber(1, 8) + '.png'
      },
      offer: {
        title: TITLES_LIST[getRandomIndex(TITLES_LIST)],
        address: getRandomNumber(1, 1000) + ', ' + getRandomNumber(1, 1000),
        price: getRandomNumber(1000, 1000000),
        type: TYPES_LIST[getRandomIndex(TYPES_LIST)],
        rooms: getRandomNumber(1, 5),
        guests: getRandomNumber(1, 100),
        checkin: times[getRandomIndex(times)],
        checkout: times[getRandomIndex(times)],
        features: getRandomValueInArray(features),
        description: '',
        photos: getShuffleArrayElement(photosList)
      },
      location: {
        x: getRandomNumber(300, 900),
        y: getRandomNumber(130, 630)
      }
    };
    array.push(obj);
  }
  return array;
};

var mapData = getMapArray();

var mapBlock = document.querySelector('.map');
mapBlock.classList.remove('map--faded');

var mapPin = document.querySelector('template').content.querySelector('.map__pin');
var mapsPin = document.querySelector('.map__pins');

for (var i = 0; i <= mapData.length; i++) {
  var pin = mapPin.cloneNode(true);
  pin.setAttribute('style', 'left: ' + mapData[i].location.x + 'px; ' + 'top: ' + mapData[i].location.y + 'px;');
  pin.setAttribute('src', mapData[i].author.avatar);
  pin.setAttribute('alt', mapData[i].offer.title);
  mapsPin.appendChild(pin);
}

