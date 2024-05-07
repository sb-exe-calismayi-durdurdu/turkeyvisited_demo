//
//
//
// explanations of some codes
//
// 

const HOVER_COLOR = "#EFAE88";
// mouse'un üzerine geldiği şehrin rengi
const MAP_COLOR = "#fff2e3";
// şehirlerin standart rengi
let cityCount = localStorage.getItem("selectedCities")
// lokalde "selectedCities" var mı kontrol et
  ? JSON.parse(localStorage.getItem("selectedCities")).length
  // eğer varsa bu JSON datalarını JS'e dönüştürüp sayısını tespit et, bu sayıyı cityCount olarak ata
  : 0;
  // eğer yoksa cityCount'u 0 olarak ata
document.getElementById("city_count").innerHTML = cityCount;
// sayfada city_count olan kısmı "cityCount" değeriyle değiştir

d3.json("tr-cities.json")
  .then(function (data) {
  // d3 modülüyle "tr-cities.json" dosyasında işlem işlemler yapılmasını sağlıyoruz
  // d3 modülünü index.html'de import etmiştik
  // .then() metodu ile .json() metodundan dönen promise başarıyla yüklenirse ne olacağını belirliyoruz
  // .then(function(data) {...}) ile function adından bir fonksiyon belirliyoruz
  // bu fonksiyonun parametresi olarak "data" değerini atıyoruz

  let width = 1200;
  // aşağıda fitSize() metodunda kullanmak üzere width...
  height = 800;
  // ve height belirliyoruz
  let projection = d3.geoEqualEarth();
  // burada bir projeksiyon tanımlanıyor
  // bu projeksiyonda d3 modülündeki "goEqualEarth()" metodunu çağırıyoruz
  // bu metod, yeryüzünün eşit alan gösterimini sağlayan bir projeksiyon oluşturur
  projection.fitSize([width, height], data);
  // fitSize() metodu - projeksiyonun belirtilen boyuta uyumlu hale getirilmesini sağlar
  // data - bu veri seti, projeksiyonun haritayı oluşturmak için kullanacağı coğrafi verileri temsil eder
  let path = d3.geoPath().projection(projection);
  // d3.geoPath() - d3'ün coğrafi verileri SVG yolu elemanına dönüştürmek için kullandığı metottur
  // bu SVG yolunun hangi projeksiyonda sergileneceği projection() metoduyla belirleniyor
  // biz üstte tanımladığımız projeksiyonu buraya atadık

  let svg = d3
    .select("#map_container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  let g = svg
    .append("g")
    .selectAll("path")
    .data(data.features)
    .join("path")
    .attr("d", path)
    .attr("fill", function (d, i) {
      if (localStorage.getItem("selectedCities")) {
        if (
          JSON.parse(localStorage.getItem("selectedCities")).includes(
            d.properties.name
          )
        ) {
          d.noFill = true;
          return HOVER_COLOR;
        } else return MAP_COLOR;
      } else return MAP_COLOR;
    })
    .attr("stroke", "#000")
    .on("mouseover", function (d, i) {
      d3.select(this).attr("fill", HOVER_COLOR);
    })
    .on("mouseout", function (d, i) {
      if (!d.noFill) d3.select(this).attr("fill", MAP_COLOR);
    })
    .on("click", function (d, i) {
      d.noFill = d.noFill || false;
      if (!d.noFill) {
        cityCount++;
        document.getElementById("city_count").innerHTML = cityCount;
        d3.select(this).attr("fill", HOVER_COLOR);

        //add selected city to localStorage
        if (localStorage.getItem("selectedCities")) {
          let tempSelectedCities = JSON.parse(
            localStorage.getItem("selectedCities")
          );
          if (tempSelectedCities.includes(d.properties.name)) return;
          tempSelectedCities.push(d.properties.name);
          localStorage.setItem(
            "selectedCities",
            JSON.stringify(tempSelectedCities)
          );
        } else {
          let tempArr = [];
          tempArr.push(d.properties.name);
          localStorage.setItem("selectedCities", JSON.stringify(tempArr));
        }
      } else {
        cityCount--;
        document.getElementById("city_count").innerHTML = cityCount;
        d3.select(this).attr("fill", MAP_COLOR);

        //remove from localStorage
        let tempSelectedCities = JSON.parse(
          localStorage.getItem("selectedCities")
        );
        const index = tempSelectedCities.indexOf(d.properties.name);
        if (index !== -1) {
          tempSelectedCities.splice(index, 1);
        }
        localStorage.setItem(
          "selectedCities",
          JSON.stringify(tempSelectedCities)
        );
      }
      d.noFill = !d.noFill;
    });

  console.log(data.features.map((f) => f.properties.name));

  g = svg.append("g");

  g.selectAll("text")
    .data(data.features)
    .enter()
    .append("text")
    .text(function (d) {
      return d.properties.name;
    })
    .attr("x", function (d) {
      return path.centroid(d)[0];
    })
    .attr("y", function (d) {
      return path.centroid(d)[1];
    })
    .attr("text-anchor", "middle")
    .attr("font-size", "10pt")
    .attr("style", "color: black;")
    .attr("style", "pointer-events: none;");
});

function downloadMap() {
  let div = document.getElementById("map_container");
  html2canvas(div).then(function (canvas) {
    var destCanvas = document.createElement("canvas");
    destCanvas.width = canvas.width;
    destCanvas.height = canvas.height;
    var destCtx = destCanvas.getContext("2d");
    destCtx.drawImage(canvas, 0, 0);

    const ctx = destCanvas.getContext("2d");
    ctx.textBaseline = "top";
    ctx.font = "2em Calibri";
    ctx.fillStyle = "black";
    ctx.textAlign = "start";
    var textWidth = ctx.measureText("ozanyerli.github.io/turkeyvisited");
    ctx.fillText("ozanyerli.github.io/turkeyvisited", 10, canvas.height - 25);
    ctx.fillText(cityCount + "/81", 10, 5);

    destCanvas.toBlob(function (blob) {
      saveAs(blob, "turkeyvisited.png");
    });
  });
}
