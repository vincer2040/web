
## router

### Introduction

This project is a solution for creating static, multi-page web applications (MPA) that
"feel" like single-page applications (SPA). It leverages browser API's such as `fetch`,
`Intersection Observer`, and the `History` API.

### Features

1. SPA like feel

    - The purpose of the library is to make multi-page applications feel like single-page.
    - It does this by preventing the default behavior when a link is pressed on the page, requesting
    the link's url via `fetch`, then replace the necessay DOM nodes.

2. Prefetching

    - The library prefetches links in order to make the transitions to the next pages faster. There
    are two whens a link can be prefetched: when it is visible, or when it is hovered over.

    - The visible method uses the `Intersection Observer` browser API to subscribe to the event
    emitted when the link is intersecting the page.

    - The hover method simply uses a `pointer enter` event.

3. Programmatic Navigation

    - The library provides an interface for the class with two methods for routing programmatically:
    `go` and `back`

    - These methods can be used to navigate to links that are not clickable on the page


### Challenges

The main challenge with this project was ensuring that all of the edge cases were covered.
Web development is very complex, and there are a lot of little things one must remember when
developing anything for the web, especially in library development.  An example of a this
is a user holding the `ctrl` key when clicking on a link, which should open the link in a new tab.
A library should never break the user's experience.

Another challenge inhibitting this project was implementing ways to ensure browser compatibility.
For now, if the `History` browser API is not available, the library simply disables itself,
and the application will behave like a normal MPA.

### Conclusion

