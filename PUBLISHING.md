# Publishing Wayfarer to GitHub Pages

Wayfarer is a static Vite app. The published website has no server, database, or logins. Character data remains in each visitor's own browser.

## Repository

GitHub owner: `AungThuraHein-Nov03`  
Recommended repository name: `Wayfarer`  
Visibility: **Public**  
Default branch: `main`

Create the repository at https://github.com/new. You may add a license later if you decide to grant reuse rights.

**Option A — GitHub connector upload (least manual work):** Select **Add a README file** when creating the public repository, then return to the ChatGPT Wayfarer conversation. The connected GitHub tool can upload the prepared source and deployment workflow to the initialized repository. There is no need to run Git commands yourself.

**Option B — Local Git push:** Create an **empty repository without a README, .gitignore or license** and follow the terminal commands below.

## First publish from PowerShell (Option B)

Open PowerShell in `E:\Projects\Wayfarer` and run:

```powershell
git init
git branch -M main
git add .
git commit -m "Release Wayfarer 1.0.1"
git remote add origin https://github.com/AungThuraHein-Nov03/Wayfarer.git
git push -u origin main
```

Git must be installed and authenticated in your terminal. If this folder already has a Git repository, skip `git init` and check your existing remote before adding another. These commands upload **source files** to GitHub, not the local `node_modules` or generated `dist` folder.

## Enable website hosting

In the new GitHub repository, open **Settings → Pages → Build and deployment → Source: GitHub Actions**. The included `.github/workflows/deploy.yml` builds and tests Wayfarer, then publishes `dist/` on each push to `main`.

Once the workflow succeeds, the expected public address is:

**https://aungthurahein-nov03.github.io/Wayfarer/**

If the website does not appear, look under the repository's **Actions** tab for the deployment job and errors. GitHub Pages may take a short period to publish after a successful workflow.

## Subsequent releases

```powershell
git add .
git commit -m "Update Wayfarer"
git push
```

Every push to `main` triggers the automated checks and deployment.

## IMPORTANT: moving your characters

The site at `127.0.0.1:5173` and the GitHub Pages site are **different browser origins** and have separate `localStorage` areas.

1. Open your existing local Wayfarer site and click **Export**.
2. Save the character library JSON somewhere safe.
3. Visit the published Wayfarer site.
4. Click **Import**, choose that JSON, and confirm.

Your saved characters do **not** automatically transfer when the website goes live. The repository and website contain app code only, not your local browser's saved character data. Avoid committing exported character JSON, personal campaign notes, or portrait files you do not want public.

## Local testing

```powershell
npm ci
npm test
npm run build
npm run dev
```

Vite's `base: './'` ensures generated asset links work under the `/Wayfarer/` GitHub Pages path and on localhost.
