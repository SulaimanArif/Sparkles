# Adding Your Custom Background Image

To add your own background image to the Sparkles website:

1. **Place your image** in this `public` folder (e.g., `background.jpg`, `space-bg.png`, etc.)

2. **Open** `frontend/src/index.css`

3. **Find** the `#root` section and **uncomment** the background image properties:

   ```css
   #root {
     min-height: 100vh;
     /* Custom background image */
     background-image: url('/your-background.jpg');  /* Change this to your image filename */
     background-size: cover;  /* or 'contain' if you want to see the full image */
     background-position: center;
     background-repeat: no-repeat;
     background-attachment: fixed;
     
     /* You can also add an overlay for better text readability */
     /* background: linear-gradient(rgba(10, 14, 39, 0.7), rgba(10, 14, 39, 0.7)), url('/your-background.jpg'); */
   }
   ```

4. **Tips:**
   - Replace `/your-background.jpg` with your actual image filename (e.g., `/space-bg.png`)
   - Use `background-size: cover` to fill the entire screen
   - Use `background-size: contain` to show the full image without cropping
   - Add a dark overlay by using the gradient + image combination shown in the comment
   - Supported formats: JPG, PNG, WebP, SVG

5. **Save** the file and your background will appear!

**Note:** If you want to remove the animated stars on the Landing/SignIn pages, you'll need to modify those components as well.
