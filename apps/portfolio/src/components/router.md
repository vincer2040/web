
## router

### about

This is a very simple library that can be used by web developers that rely on rendering
html, but want their applications to 'feel' like a SPA (single page application).

### functionality

The router has a couple features that make it more than just a basic router. It can prefetch
links that are visible on the page, and it can be used be the developer programatically (ie router.go('<route>')).

The router makes an app have a SPA-like 'feel'. This happens when a link is clicked on a web page. Normally,
the entire page would refresh, and all of the state of the application is lost. When this router is used,
when a link is clicked, the router will use the fetch api to get the link's html. It will then replace the current html
with the fetched html, all without a page-reload. Not only does this make the application feel more 'smooth', it also
allows the current state of the application to be persisted between page navigations, rather than losing the state when
the page reloads.

### difficulties

The main difficulty of the project was ensuring that all of the cases for clicking on a link were satisfied; for example,
pressing the control key while clicking on the link to open it in a new tab. Once all these cases were covered, the
rest of the development was very simple.

### programming impact

This project was relatively simple, and I like it a lot because of its simplicity. I use it in all of my web projects,
as I mainly rely on server-side rendering when I make web applications.
