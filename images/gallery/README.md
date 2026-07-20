# Gallery images

Drop your picture files in **this folder** (`images/gallery/`), then list them
in the gallery so they show up on the site.

## Adding a picture

1. Copy an image file here, e.g. `images/gallery/my-climb.jpg`
   (JPG, PNG, GIF, and WebP all work).
2. Open `../../gallery.js` and add an entry to the `GALLERY` array:

   ```js
   {
     src: 'images/gallery/my-climb.jpg',
     title: 'Sending my project',
     description: 'A short blurb. Up to 4 lines show under the thumbnail; the rest is trimmed with an ellipsis.'
   }
   ```

3. Commit and push. The grid rebuilds itself — no other changes needed.

## Notes

- Thumbnails are shown at a 4:3 crop; the full image opens in the click-through
  carousel (use the ◄ ► buttons or the arrow keys).
- The `title` line is optional. If you omit it, only the description shows.
- The starter `PHOTO 01…04` tiles in `gallery.js` are auto-generated
  placeholders — delete those entries once you've added real photos.
- Keep files reasonably sized (a few hundred KB each) so the page loads fast.
