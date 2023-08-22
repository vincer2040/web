### Features

- Makes use of the `fetch` and `History` Apis
    - When an anchor tag is clicked on the page, the router
    prevents the default behavior of the browser to fetch
    and reload the next page
    - The router requests the next page from the server
    of the application and updates the current documents
    html body with the new page
    - The router also updates the url shown by the browser
- Prefetching links
    - When enabled, the router will prefetch links that
    are visible on the page by appending a `link` tag
    that prefetches the next page
    - There is an option to change the prefetching time to when
    the link is hovered rather than when the link is visible
- Navigate programmatically
    - The consumer of the library receives an interface that has methods
    `go` and `back` that allow the consumer to conditionally navigate the
    user to a specific link or to the previous page
