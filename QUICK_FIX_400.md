# Quick Fix for 400 Bad Request on Render

If you're getting 400 Bad Request errors, the issue is likely with ALLOWED_HOSTS configuration.

## Immediate Fix

Go to your Render dashboard and add/update these environment variables:

### Required Environment Variables:

1. **ALLOWED_HOSTS** - Set this to your Render domain:
   ```
   ALLOWED_HOSTS=sparkles-y5ff.onrender.com
   ```
   (Replace `sparkles-y5ff.onrender.com` with your actual Render domain)

2. **DEBUG** - Make sure this is set to False:
   ```
   DEBUG=False
   ```

3. **SECRET_KEY** - Generate a secure key:
   ```
   SECRET_KEY=<generate-a-long-random-string>
   ```

## How to Find Your Render Domain

1. Go to your Render dashboard
2. Click on your web service
3. Look at the URL at the top - it should show something like:
   `https://sparkles-y5ff.onrender.com`
4. Use that domain (without https://) for ALLOWED_HOSTS

## After Setting Variables

1. Save the environment variables in Render
2. Render will automatically redeploy
3. Wait for the deployment to complete
4. Try accessing your site again

## Alternative: Set Multiple Domains

If you have multiple domains or want to be flexible:

```
ALLOWED_HOSTS=sparkles-y5ff.onrender.com,.onrender.com
```

The `.onrender.com` pattern will match any subdomain on Render.

## Verify It's Working

After redeployment, check the logs in Render. You should no longer see 400 errors. If you still do, check:
- The exact domain in your browser's address bar
- That ALLOWED_HOSTS matches exactly (including any subdomains)
- That you've saved and redeployed after setting the variable
