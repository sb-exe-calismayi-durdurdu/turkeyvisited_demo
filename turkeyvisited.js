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

//--------------------------İKİNCİ KISIM---------------------------------------

        //add selected city to localStorage
        if (localStorage.getItem("selectedCities")) {
          // lokalde "selectedCities" olup olmadığını kontrol ediyoruz
          let tempSelectedCities = JSON.parse(
            localStorage.getItem("selectedCities")
          );
          // eğer varsa bu ögeleri JSON nesnesinden JS nesnesine dönüştürüyoruz
          if (tempSelectedCities.includes(d.properties.name)) return;
          // şehirler daha önceden seçilmiş mi diye kontrol ediyoruz
          // eğer seçilmişse işlemi sonlandırıyoruz
          tempSelectedCities.push(d.properties.name);
          // seçilmemişleri dizine pushluyoruz
          localStorage.setItem("selectedCities", JSON.stringify(tempSelectedCities));
          // güncellenmiş listeyi lokale geri yüklüyoruz
        } else {
          // eğer seçilmiş şehir ögesi lokalde yoksa
          let tempArr = [];
          // tempArr adında bir dizi oluşturuyoruz
          tempArr.push(d.properties.name);
          // seçilen şehri dizine ekliyoruz (push)
          localStorage.setItem("selectedCities", JSON.stringify(tempArr));
          // daha sonra bu dizini lokalde seçilen şehirlere ("selectedCities") yüklüyoruz (.stringify())
        }

//------------------------ÜÇÜNCÜ KISIM------------------------------------------

      } else {
        // eğer datalardan herhangi birinin noFill özelliği true olan var ise...
        cityCount--;
        // cityCount -1 eksiltilir
        document.getElementById("city_count").innerHTML = cityCount;
        // ardından cityCount id'si "city_count" olan bir html targetına atanır
        d3.select(this).attr("fill", MAP_COLOR);
        // bunların da fill özniteliğine MAP_COLOR özelliği atanır

        //remove from localStorage
        let tempSelectedCities = JSON.parse(
          localStorage.getItem("selectedCities")
        );
        // tempSelectedCities adından bir değer tanımlanır
        // buna da JSON olan selectedCities dizisi JS'e çevrilerek yüklenir
        const index = tempSelectedCities.indexOf(d.properties.name);
        // tempSelectedCities dizisinde dataların adını aruyoruz
        if (index !== -1) {
          // eğer -1 dönmezse yani tempSelectedCities dizisinde datanın adı varsa... 
          tempSelectedCities.splice(index, 1);
          // bu durumda index'teki o 1 ögeyi diziden kaldırır
        }
        localStorage.setItem(
          // lokale data ekliyoruz
          "selectedCities",
          // lokalden "selectedCities" adında bir datayı seçtik
          JSON.stringify(tempSelectedCities)
          // "tempSelectedCities" dizisini oraya ekliyoruz
        );
      }
      d.noFill = !d.noFill;
      // mevcut veri ögesinin noFill özelliğini tersine çeviriyoruz
    });

//--------------------------DÖRDÜNCÜ KISIM---------------------------------------

  console.log(data.features.map((f) => f.properties.name));
  // verisetindeki her bir ögenin adını konsola yazdırıyoruz

  g = svg.append("g");
  // svg elemanına bir grup (group) ekliyoruz

  g.selectAll("text")
  // bu grup elemanlarının her ögesine bir text element ekliyoruz
    .data(data.features)
    // veri setini metin ögeleriyle ilişkilendiriyoruz
    .enter()
    // yeni veri ögeleri için yer tutucu oluşturuyoruz (bi bok anlamadım)
    .append("text")
    // her öge için bir metin ögesi ekliyoruz
    .text(function (d) {
      return d.properties.name;
      // metin ögelerine verisetindeki özelliklerden name olanı yazdırıyoruz
    })
    .attr("x", function (d) {
      return path.centroid(d)[0];
      // metnin x koordinatını belirliyoruz
    })
    .attr("y", function (d) {
      return path.centroid(d)[1];
      // metnin y koordinatını belirliyoruz
    })
    .attr("text-anchor", "middle")
    // metni hizalandırıyoruz
    .attr("font-size", "10pt")
    // metnin fontunu ayarlıyoruz
    .attr("style", "color: black;")
    // metnin rengini ayarlıyoruz
    .attr("style", "pointer-events: none;");
    // metnin üstündeki olayları devredışı bırakıyoruz
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
