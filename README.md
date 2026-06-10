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


# Facebook Environment Variables

Facebook is wired up exactly like Microsoft — same Auth.js flow, a second button on the
login page. Add these to `.env.local` (Facebook is OAuth2, so there is **no** issuer var):

```env
AUTH_FACEBOOK_ID=
AUTH_FACEBOOK_SECRET=
```

### What each variable means

| Variable | What it is | Where to get it |
| --- | --- | --- |
| `AUTH_FACEBOOK_ID` | The **App ID** of your Facebook app. Public, not a secret. | [developers.facebook.com](https://developers.facebook.com) → your app → **App settings → Basic**. |
| `AUTH_FACEBOOK_SECRET` | The **App Secret**. **Highly sensitive** — treat it like a password. | Same **Basic** page → click **Show** next to **App Secret**. |

## Facebook app setup

1. Go to [developers.facebook.com](https://developers.facebook.com) and create an app (type **Consumer** — "Authenticate and request data from users").
2. Add the **Facebook Login** product to the app.
3. Under **Facebook Login → Settings**, add the **Valid OAuth Redirect URI**:
   `http://localhost:3000/api/auth/callback/facebook`
4. Keep the app in **Development** mode for local testing (or add your account under **App roles → Roles** as a Tester) — `localhost` callbacks only work in Development mode.
5. From **App settings → Basic**, copy the **App ID** → `AUTH_FACEBOOK_ID` and the **App Secret** → `AUTH_FACEBOOK_SECRET` into `.env.local`.

> **Production note:** in Live mode Facebook requires an **HTTPS** redirect URI and may require **App Review** before it returns `email` for users who aren't app testers.
