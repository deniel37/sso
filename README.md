**Live demo:** https://sso-alpha-three.vercel.app/login

# Microsoft Environment Variables

All values live in `.env.local` (never commit real secrets):

```env
# Microsoft Entra ID — from your Azure app registration.
AUTH_MICROSOFT_ENTRA_ID_ID=724b7c45-e95a-44cd-a29f-38d527c1ca69
AUTH_MICROSOFT_ENTRA_ID_SECRET=<your client secret VALUE — keep only in .env.local>

# "common" lets ANY Microsoft account sign in (work, school, or personal).
# To restrict to one organization, use:
#   https://login.microsoftonline.com/<Directory (tenant) ID>/v2.0
AUTH_MICROSOFT_ENTRA_ID_ISSUER="https://login.microsoftonline.com/common/v2.0"
```

### What each variable means

| Variable | What it is | Where to get it |
| --- | --- | --- |
| `AUTH_MICROSOFT_ENTRA_ID_ID` | The **Application (client) ID** of your Azure app registration. Public, not a secret. | Azure portal → your app → **Overview**. |
| `AUTH_MICROSOFT_ENTRA_ID_SECRET` | The client secret **Value**. **Highly sensitive** — treat it like a password. | Azure portal → **Certificates & secrets** → New client secret → copy the **Value**. |
| `AUTH_MICROSOFT_ENTRA_ID_ISSUER` | The OAuth **authority**. `common` = any Microsoft account; a tenant-specific URL = that organization only. | Must **match** your app's "Supported account types" (see setup). |


## Azure / Microsoft Entra ID setup

📄 **Full walkthrough with screenshots:** [Microsoft SSO setup doc](https://docs.google.com/document/d/1s-OEYmmrkkrsl7CYh2RJmoIXupymskdZ1Yn7RaVcRc0/edit?tab=t.0#heading=h.2u2vujf9y7b6)

Quick summary of the steps:

1. Create a Microsoft (Azure) account and sign in to the [Azure portal](https://portal.azure.com).
2. Search for **Microsoft Entra ID**.
3. In the left sidebar, expand the **Manage** section.
4. Select **App registrations**.
5. Choose **New registration** from the top menu.
6. Provide the application **name**.
7. **Supported account types** → choose *"Accounts in any organizational directory (Any Microsoft Entra ID tenant — Multitenant) and personal Microsoft accounts."*
8. Choose your platform: **Web** (or **SPA**).
9. Provide the **Redirect URI**: `http://localhost:3000/api/auth/callback/microsoft-entra-id`
10. Click the **Register** button.
11. Click your app under the **All applications** section.
12. Copy the **Application (client) ID** and **Directory (tenant) ID** from the Overview page.
13. Go to **Certificates & secrets** (Client credentials).
14. Click **New client secret**, then provide a description and expiration.
15. Copy the secret **Value** (shown only once) into `AUTH_MICROSOFT_ENTRA_ID_SECRET` in `.env.local`.


# Google Environment Variables

All values live in `.env.local` (never commit real secrets). Google is OIDC, so the
issuer is built into the provider and there is **no** issuer variable:

```env
# Google — from your Google Cloud Console OAuth client.
AUTH_GOOGLE_ID=369758713515-lt3pa7d0c6ccfe77fllifs0ucninp8n8.apps.googleusercontent.com
AUTH_GOOGLE_SECRET=<your client secret VALUE — keep only in .env.local>
```

### What each variable means

| Variable | What it is | Where to get it |
| --- | --- | --- |
| `AUTH_GOOGLE_ID` | The **Client ID** of your Google OAuth client (ends in `.apps.googleusercontent.com`). Public, not a secret. | [console.cloud.google.com](https://console.cloud.google.com) → **APIs & Services → Credentials** → your OAuth client. |
| `AUTH_GOOGLE_SECRET` | The OAuth **Client secret**. **Highly sensitive** — treat it like a password. | Same **Credentials** page → your OAuth client → **Client secret**. |


## Google / Google Cloud setup

📄 **Full walkthrough with screenshots:** [Google SSO setup doc](https://docs.google.com/document/d/1s-OEYmmrkkrsl7CYh2RJmoIXupymskdZ1Yn7RaVcRc0/edit?tab=t.htgjfv5rtmhk#heading=h.w93kfj3p3yuv)

Quick summary of the steps:

1. Create a Google (Cloud) account and sign in to the [Google Cloud Console](https://console.cloud.google.com).
2. Open the **project picker** (Ctrl+O) at the top.
3. Click **New project**, give it a name, and create it.
4. Open the **Navigation menu** (☰) on the left side.
5. Select **APIs & Services**.
6. Select **Credentials**.
7. Click **Configure consent screen** (the yellow warning banner).
8. Click the **Get started** button.
9. Provide the **App name**.
10. Provide the **User support email**.
11. Select **External** for **Audience**.
12. Provide your **Contact information**.
13. Agree to the policy and click **Create**.
14. Click **Create OAuth client** (top-right).
15. Select **Web application** as the **Application type**.
16. Provide a **client name**.
17. Add the **Authorized JavaScript origins**: `http://localhost:3000`
18. Add the **Authorized redirect URIs**: `http://localhost:3000/api/auth/callback/google` (a mismatch causes `Error 400: redirect_uri_mismatch`).
19. Click the **Create** button.
20. Copy the **Client ID** → `AUTH_GOOGLE_ID` and the **Client secret** → `AUTH_GOOGLE_SECRET` in `.env.local`.
21. (Optional) **Download the JSON** file as a backup of the credentials.


# Facebook Environment Variables

All values live in `.env.local` (never commit real secrets). Facebook is OAuth2, so there
is **no** issuer variable:

```env
# Facebook — from your Facebook app (developers.facebook.com → your app).
AUTH_FACEBOOK_ID=990065050501879
AUTH_FACEBOOK_SECRET=<your App Secret VALUE — keep only in .env.local>
```

### What each variable means

| Variable | What it is | Where to get it |
| --- | --- | --- |
| `AUTH_FACEBOOK_ID` | The **App ID** of your Facebook app. Public, not a secret. | [developers.facebook.com](https://developers.facebook.com) → your app → **App settings → Basic**. |
| `AUTH_FACEBOOK_SECRET` | The **App Secret**. **Highly sensitive** — treat it like a password. | Same **Basic** page → click **Show** next to **App Secret**. |


## Facebook / Meta app setup

📄 **Full walkthrough with screenshots:** [Facebook SSO setup doc](https://docs.google.com/document/d/1s-OEYmmrkkrsl7CYh2RJmoIXupymskdZ1Yn7RaVcRc0/edit?tab=t.7e62s2i9vbs9)

Quick summary of the steps:

1. Create a Facebook (Meta) developer account at [developers.facebook.com](https://developers.facebook.com).
2. Click **Log In** in the upper-right corner.
3. Log in with Facebook (or create a new Facebook account).
4. Start creating your **Meta Developers** account.
5. Click **Continue**.
6. Verify your developer account with your **mobile number**.
7. Verify your **contact info** (primary email).
8. Under **About you**, select **Developer**.
9. Click **Complete Registration**.
10. You now land on an empty **Dashboard**.
11. Click **Create app**.
12. Provide the **App name**.
13. Select **Authenticate and request data from users with Facebook Login**.
14. Select **I don't want to connect a business portfolio yet**.
15. Click **Next**.
16. Click **Create app**.
17. Your app now appears on the **Dashboard** — click it to open it.
18. Open **Use cases → Authenticate and request data… → Customize**, and under **Permissions and features** add the **`email`** permission (`public_profile` is already granted).
19. In that use case, open **Settings** in the left panel.
20. Set the **Valid OAuth Redirect URI**: `http://localhost:3000/api/auth/callback/facebook`
21. Set the **Allowed Domains** (App Domains) to `localhost`.
22. Open **App settings → Basic** in the left panel.
23. Copy the **App ID** → `AUTH_FACEBOOK_ID`, then click **Show** and copy the **App Secret** → `AUTH_FACEBOOK_SECRET` in `.env.local`.
24. Keep the app in **Development** mode for local testing — sign-in now works end-to-end. (Going Live later requires an HTTPS redirect URI and App Review for `email`.)


# GitHub Environment Variables

All values live in `.env.local` (never commit real secrets). GitHub is OAuth2, so there
is **no** issuer variable:

```env
# GitHub — from your GitHub OAuth App.
AUTH_GITHUB_ID=Ov23lioiEqlkmCc3nMKN
AUTH_GITHUB_SECRET=<your client secret VALUE — keep only in .env.local>
```

### What each variable means

| Variable | What it is | Where to get it |
| --- | --- | --- |
| `AUTH_GITHUB_ID` | The **Client ID** of your GitHub OAuth App. Public, not a secret. | [github.com/settings/developers](https://github.com/settings/developers) → **OAuth Apps** → your app. |
| `AUTH_GITHUB_SECRET` | The OAuth App **Client secret**. **Highly sensitive** — treat it like a password. | Same app page → **Generate a new client secret** → copy the value (shown once). |


## GitHub / OAuth App setup

📄 **Full walkthrough with screenshots:** [GitHub SSO setup doc](https://docs.google.com/document/d/1s-OEYmmrkkrsl7CYh2RJmoIXupymskdZ1Yn7RaVcRc0/edit?tab=t.mpjcprhw9low#heading=h.66d8vy4pocc)

Quick summary of the steps:

1. Create a GitHub account and sign in to [github.com](https://github.com).
2. Go to your **Dashboard**.
3. Click the **user navigation** button (your avatar) in the upper-right corner.
4. Select **Settings**.
5. Scroll down to **Developer settings** in the left sidebar.
6. Select **OAuth Apps** in the left panel.
7. Click the **New OAuth App** button.
8. Provide the **Application name**.
9. Provide the **Homepage URL**: `http://localhost:3000`
10. Provide the **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github` (a mismatch causes a `redirect_uri_mismatch` error).
11. Click the **Register application** button.
12. Copy the **Client ID** → `AUTH_GITHUB_ID` in `.env.local`.
13. Click **Generate a new client secret**.
14. Copy the **Client secret** (shown only once) → `AUTH_GITHUB_SECRET` in `.env.local`.
