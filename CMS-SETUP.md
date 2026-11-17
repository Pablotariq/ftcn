# Content management setup

The site remains a static GitHub Pages site. Decap CMS edits the JSON files in
`content/`, and the page scripts read those files when visitors open the site.
Uploaded images are stored in `assets/images/uploads/`.

## Admin page

The CMS interface is at `/admin/`. Its collections are Releases, Events, Merch,
Mixes, and Editorial. Each collection is a list of entries; entries can be
reordered in the editor. Editorial entries contain an ordered list of scans.

## GitHub authentication is not configured yet

`admin/config.yml` points Decap at the `Pablotariq/ftcn` repository and its
`main` branch, but GitHub sign-in needs an OAuth/authentication service. Do not
share the admin link with the client as a working editor until that service has
been configured and tested.

Decap's standard GitHub backend requires each CMS editor to have write access
to the repository. That permission can allow changes beyond the content files.
The website's published content and images are public even if the repository
is private.

## Local preview

Serve the repository over HTTP rather than opening the HTML files directly:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000/`. The public pages can be previewed locally;
GitHub authentication for the admin page still requires the separate auth
configuration.
