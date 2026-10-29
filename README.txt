IT VAULT — VAULT AI UPDATE
LEARN • SOLVE • GROW

CONTENTS
- index.html: IT Vault site with a Vault AI chat interface
- netlify/functions/vault-ai.mjs: secure server-side OpenAI API function
- netlify.toml: Netlify function configuration
- manifest.webmanifest, sw.js, logo.png and app icons

BEFORE DEPLOYING
1. In Netlify, confirm the environment variable is named exactly OPENAI_API_KEY.
2. Do not put the secret API key in HTML, JavaScript, or this ZIP.
3. If you previously saved a different variable name (for example, ITvaulr), rename/create the exact OPENAI_API_KEY variable in Netlify and remove the incorrectly named variable.
4. API billing/credits are separate from ChatGPT and may be required. Check your OpenAI API billing and usage before testing to avoid unexpected costs.

DEPLOY
1. Extract this ZIP.
2. In the existing Netlify site, open Deploys and use the manual deploy upload area.
3. Upload the contents of the extracted folder so index.html and netlify.toml are at the top level. Do not upload the ZIP inside a nested folder.
4. Wait for the deploy to finish, then open the live site and tap Vault AI in the bottom navigation.
5. Ask a simple test question. If it fails, check Netlify function logs and the exact environment variable name.

SECURITY
- The browser calls /.netlify/functions/vault-ai.
- The OpenAI API key is read by the Netlify function from Netlify environment variables and is not included in the website code.
- Never share the API key in chat or screenshots.
- The function uses the OpenAI Responses API and the gpt-4.1-mini model. API usage may incur charges.
- AI responses may be inaccurate; verify important advice.

NOTE
This is an installable PWA website, not a native APK or a Google Play Store listing.
