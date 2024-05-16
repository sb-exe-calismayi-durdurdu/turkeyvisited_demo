const HOVER_COLOR = "#EFAE88";
const MAP_COLOR = "#fff2e3";

let cityCount = localStorage.getItem("selectedCities")
  ? JSON.parse(localStorage.getItem("selectedCities")).length
  : 0;
document.getElementById("city_count").innerHTML = cityCount;

let marmarasayaci = localStorage.getItem("marmaraSehirleri")
  ? JSON.parse(localStorage.getItem("marmaraSehirleri")).length
  : 0;
document.getElementById("marmara").innerHTML = marmarasayaci;

let egesayaci = localStorage.getItem("egeSehirleri")
  ? JSON.parse(localStorage.getItem("egeSehirleri")).length
  : 0;
document.getElementById("ege").innerHTML = egesayaci;

let akdenizsayaci = localStorage.getItem("akdenizSehirleri")
  ? JSON.parse(localStorage.getItem("akdenizSehirleri")).length
  : 0;
document.getElementById("akdeniz").innerHTML = akdenizsayaci;

let karadenizsayaci = localStorage.getItem("karadenizSehirleri")
  ? JSON.parse(localStorage.getItem("karadenizSehirleri")).length
  : 0;
document.getElementById("karadeniz").innerHTML = karadenizsayaci;

let icanadolusayaci = localStorage.getItem("icanadoluSehirleri")
  ? JSON.parse(localStorage.getItem("icanadoluSehirleri")).length
  : 0;
document.getElementById("icanadolu").innerHTML = icanadolusayaci;

let doguanadolusayaci = localStorage.getItem("doguanadoluSehirleri")
? JSON.parse(localStorage.getItem("doguanadoluSehirleri")).length
: 0;
document.getElementById("doanadolu").innerHTML = doguanadolusayaci;

let gdoguanadolusayaci = localStorage.getItem("gdoguanadoluSehirleri")
? JSON.parse(localStorage.getItem("gdoguanadoluSehirleri")).length
: 0;
document.getElementById("gudoanadolu").innerHTML = gdoguanadolusayaci;


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
        if (JSON.parse(localStorage.getItem("selectedCities")).includes(d.properties.name)) {
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
        cityCount++
        if (d.properties.base === "marmara") {
          if (localStorage.getItem("marmaraSehirleri")) {
            let mLocal = JSON.parse(localStorage.getItem("marmaraSehirleri"))
            if (mLocal.includes(d.properties.name)) return
            mLocal.push(d.properties.name)
            localStorage.setItem("marmaraSehirleri", JSON.stringify(mLocal))
          } else {
            let mDizin = []
            mDizin.push(d.properties.name)
            localStorage.setItem("marmaraSehirleri", JSON.stringify(mDizin))
          }
          marmarasayaci++
        }
        if (d.properties.base === "ege") {
          if (localStorage.getItem("egeSehirleri")) {
            let eLocal = JSON.parse(localStorage.getItem("egeSehirleri"))
            if (eLocal.includes(d.properties.name)) return
            eLocal.push(d.properties.name)
            localStorage.setItem("egeSehirleri", JSON.stringify(eLocal))
          } else {
            let eDizin = []
            eDizin.push(d.properties.name)
            localStorage.setItem("egeSehirleri", JSON.stringify(eDizin))
          }
          egesayaci++
          
        }
        if (d.properties.base === "akdeniz") {
          if (localStorage.getItem("akdenizSehirleri")) {
            let aLocal = JSON.parse(localStorage.getItem("akdenizSehirleri"))
            if (aLocal.includes(d.properties.name)) return
            aLocal.push(d.properties.name)
            localStorage.setItem("akdenizSehirleri", JSON.stringify(aLocal))
          } else {
            let aDizin = []
            aDizin.push(d.properties.name)
            localStorage.setItem("akdenizSehirleri", JSON.stringify(aDizin))
          }
          akdenizsayaci++
        }
        if (d.properties.base === "karadeniz") {
          if (localStorage.getItem("karadenizSehirleri")) {
            let kLocal = JSON.parse(localStorage.getItem("karadenizSehirleri"))
            if (kLocal.includes(d.properties.name)) return
            kLocal.push(d.properties.name)
            localStorage.setItem("karadenizSehirleri", JSON.stringify(kLocal))
          } else {
            let kDizin = []
            kDizin.push(d.properties.name)
            localStorage.setItem("karadenizSehirleri", JSON.stringify(kDizin))
          }
          karadenizsayaci++
        }
        if (d.properties.base === "icanadolu") {
          if (localStorage.getItem("icanadoluSehirleri")) {
            let iLocal = JSON.parse(localStorage.getItem("icanadoluSehirleri"))
            if (iLocal.includes(d.properties.name)) return
            iLocal.push(d.properties.name)
            localStorage.setItem("icanadoluSehirleri", JSON.stringify(iLocal))
          } else {
            let iDizin = []
            iDizin.push(d.properties.name)
            localStorage.setItem("icanadoluSehirleri", JSON.stringify(iDizin))
          }
          icanadolusayaci++
        }
        if (d.properties.base === "doguanadolu") {
          if (localStorage.getItem("doguanadoluSehirleri")) {
            let dLocal = JSON.parse(localStorage.getItem("doguanadoluSehirleri"))
            if (dLocal.includes(d.properties.name)) return
            dLocal.push(d.properties.name)
            localStorage.setItem("doguanadoluSehirleri", JSON.stringify(dLocal))
          } else {
            let dDizin = []
            dDizin.push(d.properties.name)
            localStorage.setItem("doguanadoluSehirleri", JSON.stringify(dDizin))
          }
          doguanadolusayaci++
        }
        if (d.properties.base === "gdoguanadolu") {
          if (localStorage.getItem("gdoguanadoluSehirleri")) {
            let gLocal = JSON.parse(localStorage.getItem("gdoguanadoluSehirleri"))
            if (gLocal.includes(d.properties.name)) return
            gLocal.push(d.properties.name)
            localStorage.setItem("gdoguanadoluSehirleri", JSON.stringify(gLocal))
          } else {
            let gDizin = []
            gDizin.push(d.properties.name)
            localStorage.setItem("gdoguanadoluSehirleri", JSON.stringify(gDizin))
          }
          gdoguanadolusayaci++
        }

        document.getElementById("city_count").innerHTML = cityCount;
        d3.select(this).attr("fill", HOVER_COLOR);

        //add selected city to localStorage
        if (localStorage.getItem("selectedCities")) {
          let tempSelectedCities = JSON.parse(localStorage.getItem("selectedCities"));
          if (tempSelectedCities.includes(d.properties.name)) return;
          tempSelectedCities.push(d.properties.name);
          localStorage.setItem("selectedCities", JSON.stringify(tempSelectedCities));
        } else {
          let tempArr = [];
          tempArr.push(d.properties.name);
          localStorage.setItem("selectedCities", JSON.stringify(tempArr));
        }

      } else {
        cityCount--;
        if (d.properties.base === "marmara") {
          let marLocal = JSON.parse(localStorage.getItem("marmaraSehirleri"))
          const indexM = marLocal.indexOf(d.properties.name)
          if (indexM !== -1) {marLocal.splice(indexM, 1)}
          localStorage.setItem("marmaraSehirleri", JSON.stringify(marLocal))
          marmarasayaci--
        }
        if (d.properties.base === "ege") {
          let egeLocal = JSON.parse(localStorage.getItem("egeSehirleri"))
          const indexE = egeLocal.indexOf(d.properties.name)
          if (indexE !== -1) {egeLocal.splice(indexE, 1)}
          localStorage.setItem("egeSehirleri", JSON.stringify(egeLocal))
          egesayaci--
        }
        if (d.properties.base === "akdeniz") {
          let akLocal = JSON.parse(localStorage.getItem("akdenizSehirleri"))
          const indexA = akLocal.indexOf(d.properties.name)
          if (indexA !== -1) {akLocal.splice(indexA, 1)}
          localStorage.setItem("akdenizSehirleri", JSON.stringify(akLocal))
          akdenizsayaci--
        }
        if (d.properties.base === "karadeniz") {
          let kaLocal = JSON.parse(localStorage.getItem("karadenizSehirleri"))
          const indexK = kaLocal.indexOf(d.properties.name)
          if (indexK !== -1) {kaLocal.splice(indexK, 1)}
          localStorage.setItem("karadenizSehirleri", JSON.stringify(kaLocal))
          karadenizsayaci--
        }
        if (d.properties.base === "icanadolu") {
          let icLocal = JSON.parse(localStorage.getItem("icanadoluSehirleri"))
          const indexI = icLocal.indexOf(d.properties.name)
          if (indexI !== -1) {icLocal.splice(indexI, 1)}
          localStorage.setItem("icanadoluSehirleri", JSON.stringify(icLocal))
          icanadolusayaci--
        }
        if (d.properties.base === "doguanadolu") {
          let doLocal = JSON.parse(localStorage.getItem("doguanadoluSehirleri"))
          const indexD = doLocal.indexOf(d.properties.name)
          if (indexD !== -1) {doLocal.splice(indexD, 1)}
          localStorage.setItem("doguanadoluSehirleri", JSON.stringify(doLocal))
          doguanadolusayaci--
        }
        if (d.properties.base === "gdoguanadolu") {
          let gdLocal = JSON.parse(localStorage.getItem("gdoguanadoluSehirleri"))
          const indexG = gdLocal.indexOf(d.properties.name)
          if (indexG !== -1) {gdLocal.splice(indexG, 1)}
          localStorage.setItem("gdoguanadoluSehirleri", JSON.stringify(gdLocal))
          gdoguanadolusayaci--
        }
        document.getElementById("city_count").innerHTML = cityCount;
        d3.select(this).attr("fill", MAP_COLOR);

        //remove from localStorage
        let tempSelectedCities = JSON.parse(localStorage.getItem("selectedCities"));
        const index = tempSelectedCities.indexOf(d.properties.name);
        if (index !== -1) {tempSelectedCities.splice(index, 1);}
        localStorage.setItem("selectedCities", JSON.stringify(tempSelectedCities));
      }
      d.noFill = !d.noFill;
      document.getElementById("marmara").innerHTML = marmarasayaci
      document.getElementById("ege").innerHTML = egesayaci;
      document.getElementById("akdeniz").innerHTML = akdenizsayaci;
      document.getElementById("karadeniz").innerHTML = karadenizsayaci;
      document.getElementById("icanadolu").innerHTML = icanadolusayaci;
      document.getElementById("doanadolu").innerHTML = doguanadolusayaci;
      document.getElementById("gudoanadolu").innerHTML = gdoguanadolusayaci;
    });

  console.log(data.features.map((f) => f.properties.name));
  console.log(data.features.map((f) => f.properties.base))

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

function toggleVisibility() {
  var div = document.getElementById("bolgeler")
  if (div.style.display === "none") {
    div.style.display = "block"
  } else {
    div.style.display = "none"
  }
  if (div) {
    var divPosition = div.getBoundingClientRect().top;
    window.scrollTo({top: divPosition});
  }
}
