function buildMetadata(sample) {
  let metadataSample = "/metadata/" + sample;
  console.log(metadataSample);

  // Use d3 to select the panel with id of `#sample-metadata`
  // Use `Object.entries` to add each key and value pair to the panel

  d3.json(metadataSample).then(function(response) {
    let metadataPanel = d3.select("#sample-metadata");
    let data = [response]
    metadataPanel.html("");
    data.forEach (function(data) {
      Object.entries(data).forEach(([key, value]) => {
      let row = metadataPanel.append("tr");
      row.append("td").html(`<strong><font size = '1'>${key}</font></strong>:`);
      row.append("td").html(`<font size = '1'>${value}</font>`);

      // metadataPanel.enter()
      //   .append("#sample-metadata")
      //   .text(`${key} : ${value}`);
      })
    });
  });   
}

function buildCharts(sample) {
  let plotData = "/samples/" + sample;
  d3.json(plotData).then(function(d) {
    // Build a Bubble Chart using the sample data
    let trace1 = {
      x: d.otu_ids,
      y: d.sample_values,
      mode: 'markers',
      text: d.otu_labels,
      marker: {
        color: d.otu_ids,
        size: d.sample_values,
      }
    }

    let bubbleData = [trace1];
    let bubbleLayout = {
        // showLegend: false,
        height: 700,
        width: 1200,
        title: "Bubble Chart - All Samples"
    };

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // @TODO: Build a Pie Chart
  
    let trace2 = {
      values: d.sample_values.slice(0,10),
      labels: d.otu_ids.slice(0,10),
      hovertext: d.otu_labels.slice(0,10),
      type: "pie",
    };

    let pieData = [trace2];

    let pieLayout = {
      // showLegend: true,
      //  autosize: false,
      width: 600,
      height: 600,
      title: "Pie Chart - Top 10 Samples"
    }
    Plotly.newPlot('pie', pieData, pieLayout);
  });
}

function init() {
  // Grab a reference to the dropdown select element
  let selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
