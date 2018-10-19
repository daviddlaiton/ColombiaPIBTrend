const data = "data/data.json";

margin = ({ top: 20, right: 0, bottom: 30, left: 60 })
    , width = 1000
    , height = 600
    , marginbar = 2;


d3.json(data).then(datos => {

    var svg = d3.select("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    var x = d3.scaleBand()
        .domain(datos.map(d => d.year))
        .range([margin.left, width - margin.right])
        .padding(0.1);

    var y = d3.scaleLinear()
        .domain([0, d3.max(datos, d => d.total)]).nice()
        .range([height - margin.bottom, margin.top]);

    var z = d3.scaleOrdinal()
        .range(["#98abc5", "#8a89a6"]);

    var xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x)
            .tickSizeOuter(0));

    var yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .call(g => g.select(".domain").remove());

    const bar = svg.append("g")
        .selectAll("rect").data(datos).enter().append("rect")
        .attr("x", d => x(d.year) + 35)
        .attr("y", d => y(d.total))
        .attr("height", d => y(0) - y(d.total))
        .attr("width", (x.bandwidth() / 3))
        .attr("fill", "#98abc5");

    const bar2 = svg.append("g")
        .selectAll("rect").data(datos).enter().append("rect")
        .attr("x", d => x(d.year) + 12)
        .attr("y", d => y(d.agriculture))
        .attr("height", d => y(0) - y(d.agriculture))
        .attr("width", (x.bandwidth() / 3))
        .attr("fill", "#8a89a6");

    const legend = svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
        .selectAll("g")
        .data(["GDP Increase", "Agriculture Increase "].slice())
        .enter().append("g")
        .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 15)
        .attr("y", 0)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", z);

    legend.append("text")
        .attr("x", width - 20)
        .attr("y", 8)
        .attr("dy", "0.32em")
        .text(function (d) { return d; });

    const gx = svg.append("g")
        .call(xAxis)
        .append("text")
        .attr("x", 600)
        .attr("y", y(y.ticks().pop()) + 20)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("font-size", 20)
        .attr("text-anchor", "start")
        .text("Year");

    const gy = svg.append("g")
        .call(yAxis)
        .append("text")
        .attr("x", 2)
        .attr("y", y(y.ticks().pop()) + 0.5)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("font-size", 20)
        .attr("text-anchor", "start")
        .text("Percentage increase");

    svg.node().update = () => {
        const t = svg.transition()
            .duration(750);

        bar.data(datos, d => d.year)
            .order()
            .transition(t)
            .delay((d, i) => i * 20)
            .attr("x", d => x(d.year) + 40)
            .attr("y", d => y(d.total))
            .attr("height", d => y(0) - y(d.total));

        bar2.data(datos, d => d.year)
            .order()
            .transition(t)
            .delay((d, i) => i * 20)
            .attr("x", d => x(d.year) + 13)
            .attr("y", d => y(d.agriculture))
            .attr("height", d => y(0) - y(d.agriculture));

        gx.transition(t)
            .call(xAxis)
            .selectAll(".tick")
            .delay((d, i) => i * 10);

    };

    $("#graphSelector").change(function orderBy() {
        let selectedItem = $("#graphSelector").val();
        switch (selectedItem) {
            case "year":
                datos.sort((a, b) => a.year - b.year);
                break;
            case "total":
                datos.sort((a, b) => a.total - b.total);
                break;
            case "agriculture":
                datos.sort((a, b) => a.agriculture - b.agriculture);
                break;
        }
        x.domain(datos.map(d => d.year));
        svg.node().update();
    });

});