//
//
//
// explanations of some codes
//
// 

const HOVER_COLOR = "#EFAE88";
const MAP_COLOR = "#fff2e3";

let cityCount = localStorage.getItem("selectedCities")
  ? JSON.parse(localStorage.getItem("selectedCities")).length
  : 0;
document.getElementById("city_count").innerHTML = cityCount;

d3.json("tr-cities.json")
  .then(function (data) {

  let width = 1200;
  height = 800;
  let projection = d3.geoEqualEarth();
  projection.fitSize([width, height], data);
  let path = d3.geoPath().projection(projection);


//--------------------GİTHUB'TA BURADAYIZ----------------------------

  let svg = d3
  // bir SVG nesnesi tanımlıyoruz
    .select("#map_container")
    // html sayfasındaki "map_container" id'sine sahip bir elemanı seçiyoruz
    .append("svg")
    // ona bir svg nesnesi ekliyoruz
    .attr("width", width)
    // svg nesnesinin genişliğini yukarıda tanımladığımız width değeri olarak belirtiyoruz 
    .attr("height", height);
    // svg nesnesinin yüksekliği yukarıda tanımladığımız height değeri olarak belirtiyoruz 

  let g = svg
  // SVG elemanına bağlı bir grup oluşturuyoruz
    .append("g")
    // bu gruba yeni bir grup ekliyoruz
    .selectAll("path")
    // bu grup içindeki tüm "path" elemanlarını seçiyoruz
    .data(data.features)
    // verisetindeki her datanın özellikleriyle (features) ilişkilendirilmiş bir seçim oluşturuyoruz
    // yani json dosyasındaki her şehrin özelliklerini seçiyoruz
    .join("path")
    // her bir veri öğesi için bir <path> elemanı oluşturuluyor
    // bu, her bir öğenin bir <path> öğesi içinde görselleştirilmesi anlamına gelir
    .attr("d", path)
    // burada her bir dataya path atanıyor (d = data)
    .attr("fill", function (d, i) {
      // her bir "fill" özniteliğinin hangi fonksiyon tarafından ayarlanacağı burada belirtiliyor
      if (localStorage.getItem("selectedCities")) {
        // eğer lokalde "selectedCities" ögesi varsa
        if (
          JSON.parse(localStorage.getItem("selectedCities")).includes(
            // eğer "selectedCities" ögesinde...
            d.properties.name
            // dataların özelliklerinde (properties) "name" özelliği varsa
          )
        ) {
          d.noFill = true;
          // dataların "noFill" özelliğini "true" olarak ayarla
          return HOVER_COLOR;
          // ve "HOVER_COLOR" özelliğini döndür
        } else return MAP_COLOR;
        // eğer "selectedCities" nesnesinde dataların "name" özelliği yoksa...
        // "MAP_COLOR" özelliğini döndür
      } else return MAP_COLOR;
      // eğer lokalde "selectedCities" ögesi yoksa da "MAP_COLOR" özelliğini döndür
    })



//-------------------------BİRİNCİ KISIM--------------------------------------
    .attr("stroke", "#000")
    // "stroke" özniteliğine (kenarlık) bir renk değeri atanıyor
    .on("mouseover", function (d, i) {
      // "mouseover" olunca (fare ögenin üstüne geldiğinde) şu işlemi yap...
      d3.select(this).attr("fill", HOVER_COLOR);
      // dataları seç ve onların "fill" özniteliğini "HOVER_COLOR" olarak ata
      // yani ögenin rengini "HOVER_COLOR" olarak değiştir
    })
    .on("mouseout", function (d, i) {
      // "mouseout" olunca (fare ögenin üstünden ayrıldığında) şu işlemi yap...
      if (!d.noFill) d3.select(this).attr("fill", MAP_COLOR);
      // "d.noFill" ifadesi false ise bu datayı seç ve "fill" özniteliğini "MAP_COLOR" olarak ata
      // yani eski rengine geri döndür.
    })
    .on("click", function (d, i) {
      // "click" olunca (ögeye tıklandığında) şu işlemi yap...
      d.noFill = d.noFill || false;
      // tüm dataların "noFill" özniteliğine bakılır, eğer true ise true kalır ama eğer değilse false değeri atanır.
      if (!d.noFill) {
        // eğer datalardan "noFill" özniteliği false olan var ise...
        cityCount++;
        // "cityCount" değeri +1 artırılır
        document.getElementById("city_count").innerHTML = cityCount;
        // html sayfasındaki "city_count" id'sine "cityCount" değeri yazılır
        d3.select(this).attr("fill", HOVER_COLOR);
        // ve bu datalar seçilip, bu dataların "fill" özniteliği "HOVER_COLOR" olarak atanır
        // yani ögelerin rengi "HOVER_COLOR" olarak değiştirilir


//--------------------------İKİNCİ KISIM---------------------------------------
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

//------------------------ÜÇÜNCÜ KISIM------------------------------------------
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

//--------------------------DÖRDÜNCÜ KISIM---------------------------------------
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

//---------------------------------BEŞİNCİ KISIM-----------------------------------
function downloadMap() {
  let div = document.getElementById("map_container");
  html2canvas(div).then(function (canvas) {
    var destCanvas = document.createElement("canvas");
    destCanvas.width = canvas.width;
    destCanvas.height = canvas.height;
    var destCtx = destCanvas.getContext("2d");
    destCtx.drawImage(canvas, 0, 0);

//--------------------------------ALTINCI KISIM-------------------------------------
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
