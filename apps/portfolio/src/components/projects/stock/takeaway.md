### Takeaway

I really enjoyed this project because I was able to create a tool to
do research and customize it to my personal needs and display the information
that I believe was important. As I discussed on the [about me](/about) page,
I was rather disappointed with a lot of the websites that were already out there
when it came to researching stocks, which is what drove me to create this
web site.

I have actually built this website quite a few times; whenever a new web framework
comes out, I attempt to implement this application in that framework. When I first
built this website, I used React, Nodejs, and MySQL. Next, I built this site using
Angular, Nodejs, and MongoDB. After that, metaframeworks, which advertise themselves
as being an "all in one" solution for both the frontend and the backend, started to
become rather popular, and I built the app using sveltekit and mongoDB. Finally, the
application is currently being rewritten with Htmx, Golang, and sqlite. I really like this
final stack and will likely keep it this way, no matter what new framework comes next.
Go templates along with htmx are extremely powerful when rendering content server-side,
and it removes a lot of potential mishaps that can occur when communicating with the server
using a protocol such as JSON, which I used in the previous versions of the applications.

Building this site with htmx has had some challenges though. The site generates charts
to display income statement, balance sheet, and cashflow information on the client. I wasn't
able to find a Go library that generated html fragments of charts on the server - most of them
either generated full html pages only or generated images that were to be written to disk,
which would not be good for this implementation. The solution I came up with for this was to
use a frontend charting library and leverage Go html templates to generate javascript code
that would render the charts. For example, this is the template that renders the chart that
displays revenue:

```html
<div id="revenue" style="width: 600px"></div>
<script>
    revenueChart = document.getElementById("revenue");
    revenueData = [
        {
            x: [
                {{ range .Dates }}
                {{ . }},
                {{ end }}
            ],
            y: [
                {{ range .Revenues }}
                parseInt({{ . }}),
                {{ end }}
            ],
                type: "bar",
        }
    ];
    Plotly.newPlot(revenueChart, revenueData, { title: "Total Revenue" }, { responsive: true });
</script>
```

Rather than using Go templates in the html, I used it in the javascript to generate
the code that would render the chart. I was actually quite surprised when it worked the first time,
and I can see myself using this paradigm more in the future if necessary.

