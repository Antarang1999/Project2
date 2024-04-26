var svg = d3.select('#pie_svg')

function submitText(){
    svg.select('g').remove();
    var textareaElement = document.getElementById("wordbox");
    var textContent = textareaElement.value; 
    textContent = textContent.toLowerCase();

    var vowelList = ["a", "e", "i", "o", "u", "y"];
    var punctuationList = [".", ",", "?", "!", ":", ";"];
    var consonantList =["b","c","d", "f","g", "h", "j", "k", "l", "m", "n", "p", "q", "r", "s", "t", "v", "w", "x","z"]
    var vowelcounter = 0 , consonantcounter = 0 ,  punctuationcounter = 0 ;
    var vowel = {};
    var consonant = {};
    var punctuation = {};

    for (var i=0;i<vowelList.length;i++){
        vowel[vowelList[i]] = 0;
    }
    for (var i=0;i<punctuationList.length;i++){
        punctuation[punctuationList[i]] = 0;
    }
    for (var i=0;i<consonantList.length;i++){
        consonant[consonantList[i]] = 0;
    }
    for (var i = 0; i < textContent.length; i++) {
        var char = textContent.charAt(i);
       
        if (vowelList.includes(char)) {
            vowelcounter ++;
            if(char in vowel){
                vowel[char]+=1
            }
            else{
                vowel[char]=1
            }
        } 
        
        else if (punctuationList.includes(char)) { 
            punctuationcounter++;
            if(char in punctuation){
                punctuation[char]+=1
            }
            else{
                punctuation[char]=1
            }
        }

        else if(consonantList.includes(char)){ 
            consonantcounter++;
            if(char in consonant){
                consonant[char]+=1
            }
            else{
                consonant[char]=1
            }
        } 

         }
        
    var data = {vowel: vowelcounter, consonant: consonantcounter, punctuation: punctuationcounter}   

    var characterCountList = {
        vowel : vowel ,
        consonant: consonant ,
        punctuation: punctuation };
    
    const width = 600,
     height = 400
     
    
    
    const radius = 180
    
    svg.select('g').remove();
   
    svg = d3.select("#pie_svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class","doc")
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);
    
 
  
    const color = d3.scaleOrdinal()
    .range([
        " #800080","#008080","#FFC0CB"
    ])

    const pie = d3.pie()
    .value(d=>d[1])
    .sort(null)

    const data_ready = pie(Object.entries(data))
 
    
    const arcGroup = svg.append("g");


    const textGroup = svg.append("g");

    var paths = arcGroup.selectAll('donut_chart')
        .data(data_ready)
        .join('path')
        .attr('d', d => {
            
            if (d.data[1] === 0) {
                return null;
            } else {
                return d3.arc()
                    .innerRadius(100)
                    .outerRadius(radius)(d);
            }
        })
        .attr('fill', d => color(d.data[0]))
        .attr("stroke", "black")
        .style("stroke-width", "1px")
        .style("opacity", 1)
       
        paths.on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut) 
        .on("click", handleArcClick); 


        function handleArcClick(event, d) {
            const selectedCategory = d.data[0];
    
            const selectedCategoryObject = characterCountList[selectedCategory];         
        
            createBarChart(selectedCategory,selectedCategoryObject, color(selectedCategory));

        }
        
        

        function createBarChart(category, data, color) {
           
           
            const margin = { top: 20, right: 20, bottom: 30, left: 40 };
            const width = 580 - margin.left - margin.right;
            const height = 400 - margin.top - margin.bottom;


        d3.select("#bar_svg").select('g') .remove();

        var bar_svg = d3.select("#bar_svg")
                    .attr("width", width)
                    .attr("height", height)
                    .attr("class","cfsc")
                    .append("g")
                    .attr("transform", `translate(${margin.left},${margin.top})`);
        
            const dataArray = Object.entries(data); 
            const maxDataValue = d3.max(dataArray, d => d[1]);
         
            const x = d3.scaleBand()
                .domain(dataArray.map(d => d[0])) 
                .range([0, width])
                .padding(0.2);
        
            const y = d3.scaleLinear()
                .domain([0, d3.max(dataArray, d => d[1])])
                .nice()
                .range([height, 0]);
        
            var bar_chart = bar_svg.append('g')
           

            const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")

           
            bar_chart.selectAll(".bar")
                .data(dataArray)
                .join("rect")
                .attr("class", "bar")
                .attr("x", d => x(d[0])) 
                .attr("y", d => y(d[1])) 
                .attr("width", x.bandwidth() ) 
                .attr("height", d => height - y(d[1]))
                .attr("fill", color)
                .attr("stroke", "black")
                .attr("stroke-width", 1)
                .on("mousemove", function (event, d) { 
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", 1);
                    tooltip.html(`Character: ${d[0]}<br>Count: ${d[1]}`)
                        .style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY - 30) + "px");
                        document.getElementById("character-name").textContent = `${d[0]} is ${d[1]}`;
                })
                .on("mouseout", function () {
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                        document.getElementById("character-name").textContent = "{Select a character}";
                });

           
            const xAxis = d3.axisBottom(x);
            const yAxis = d3.axisLeft(y);
        
            bar_svg.append("g")
                .attr("class", "x-axis")
                .attr("transform", `translate(0,${height})`)
                .call(xAxis)
                .attr("font-size","12px");

            bar_svg.append("g")
                .attr("class", "y-axis")
                .call(yAxis)
                .attr("font-size","12px");
        
        }
        

        document.getElementById("submit_button").addEventListener("click", clearBarChart);
        
        function clearBarChart() {
            document.getElementById("character-name").textContent = "NONE";
            d3.select("#bar_svg").selectAll("*").remove();
        }
        
        function handleMouseOver(event, d) {
            d3.select(this)
                .style("stroke-width", 4); 
            
           
            textGroup.selectAll("text").remove(); 
            textGroup.append("text")
                .attr("text-anchor", "middle")
                .attr("dy", "5px")
                .style("font-size", "24px") 
                .text(`${d.data[0]}: ${d.data[1]}`) 
                .style("fill", "black");
        }
        
      
        function handleMouseOut(event, d) {
            d3.select(this)
                .style("stroke-width", 1); 

            textGroup.selectAll("text").remove();
        }

}