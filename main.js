var apiKey = "fde03fda06284279896a38b5b79a835f";
var newsList = [];
var menus = document.querySelectorAll(".menus button");
menus.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByCategory(event))
);

var url = new URL(
  `https://newsapi.org/v2/top-headlines?country=kr&apiKey=${apiKey}`
);

var weatherIcon = {
  "01": "fas fa-sun",
  "02": "fas fa-cloud-sun",
  "03": "fas fa-cloud",
  "04": "fas fa-cloud-meatball",
  "09": "fas fa-cloud-sun-rain",
  10: "fas fa-cloud-showers-heavy",
  11: "fas fa-poo-storm",
  13: "far fa-snowflake",
  50: "fas fa-smog",
};

var apiURI =
  "http://api.openweathermap.org/data/2.5/weather?q=seoul&appid=c1822a962ec35674f8e9c91e4ca74f1c";
$.ajax({
  url: apiURI,
  dataType: "json",
  type: "GET",
  async: "false",
  success: function (resp) {
    var icon = resp.weather[0].icon.substr(0, 2);
    var weatherDescription = resp.weather[0].main;
    var temp = Math.floor(resp.main.temp - 273.15) + "°C";
    var humidity = "습도 : " + resp.main.humidity + " %";
    var wind = "바람 : " + resp.wind.speed + " m/s";
    var city = "서울";
    var cloud = "구름 : " + resp.clouds.all + " %";
    var tempMin =
      "최저 온도 : " + Math.floor(resp.main.temp_min - 273.15) + "°C";
    var tempMax =
      "최고 온도 : " + Math.floor(resp.main.temp_max - 273.15) + "°C";

    $("#weatherIcon").append(
      '<i class="' +
        weatherIcon[icon] +
        ' fa-5x" style="height : 50px; width : 50px;"></i>'
    );
    $("#weatherDescription").prepend(weatherDescription);
    $("#currentTemp").prepend(temp);
    $("#humidity").prepend(humidity);
    $("#wind").prepend(wind);
    $("#city").append(city);
    $("#cloud").append(cloud);
    $("#tempMin").append(tempMin);
    $("#tempMax").append(tempMax);
  },
});

var totalResult = 0;
var page = 1;
const pageSize = 10;
const groupSize = 5;

async function getNews() {
  try {
    url.searchParams.set("page", page);
    url.searchParams.set("pageSize", pageSize);
    var response = await fetch(url); //url 호출하기전에 page랑 pageSize 붙이기
    var data = await response.json();
    console.log(data);
    if (response.status === 200) {
      if (data.articles.length == 0) {
        throw new Error("관련 기사가 없습니다.");
      }
      newsList = data.articles;
      totalResult = data.totalResults; // 총 페이지 수
      render();
      paginationRender();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    errorRender(error.message);
  }
}

async function getLatestNews() {
  url = new URL(
    `https://newsapi.org/v2/top-headlines?country=kr&apiKey=${apiKey}`
  );
  console.log("url:", url);
  var response = await fetch(url); //데이터를 받을때까지 기다려줌
  var data = await response.json();
  getNews();
  console.log("newsList", newsList);
}

async function getNewsByCategory(event) {
  var category = event.target.id;
  url = new URL(
    `https://newsapi.org/v2/top-headlines?country=kr&category=${category}&apiKey=${apiKey}`
  );
  getNews();
}

function render() {
  var newsHTML = ``;
  newsHTML = newsList
    .map(
      (news) => ` <div class="news row">
        <div class="col-lg-4">
            <img class="newsImageSize"src="${news.urlToImage}">
        </div>
        <div class="col-lg-8">
            <a class="title" target="_blank" href="${news.url}">${news.title}</a>
            <p> ${news.description}</p>
            <div>
                ${news.source.name} * ${news.publishedAt}
            </div>
        </div>
    </div>`
    )
    .join(""); //,없애기

  document.getElementById("newsBoard").innerHTML = newsHTML;
}

function errorRender(errorMessage) {
  var errorHTML = `
    <div class="alert alert-danger" role="alert">
    ${errorMessage}
    </div>`;
  document.getElementById("newsBoard").innerHTML = errorHTML;
}

function paginationRender() {
  var pageGroup = Math.ceil(page / groupSize);
  var totalPage = Math.ceil(totalResult / pageSize);
  var lastPage = pageGroup * groupSize;
  if (lastPage > totalPage) {
    lastPage = totalPage;
  }
  var firstPage = lastPage - (groupSize - 1);
  if (lastPage - (groupSize - 1) <= 0) {
    firstPage = 1;
  }

  var paginationHTML = `<li class="page-item" onclick="moveToPage(${page - 1})">
      </li>`;

  for (var i = firstPage; i <= lastPage; i++) {
    paginationHTML += `<li class="page-item ${
      i == page ? "active" : ""
    }" onclick="moveToPage(${i})">
    <a class="page-link">
      ${i}
    </a>
  </li>`;
  }

  paginationHTML += `<li class="page-item" onclick="moveToPage(${page - 1})">
    </li>`;

  document.querySelector(".pagination").innerHTML = paginationHTML;
}

getLatestNews();

async function getNewsByKeyword() {
  var keyword = document.getElementById("searchInput").value;
  url = new URL(
    `https://newsapi.org/v2/top-headlines?country=kr&q=${keyword}&apiKey=${apiKey}`
  );
  getNews();
}

function moveToPage(pageNum) {
  page = pageNum;
  getNews();
}
