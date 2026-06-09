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

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Search for **Microsoft Entra ID**.
3. In the left sidebar, expand the **Manage** section.
4. Select **App registrations**.
5. Click **New registration** (top menu).
6. Provide an application **name**.
7. **Supported account types** → choose *"Accounts in any organizational directory (Any Microsoft Entra ID tenant — Multitenant) and personal Microsoft accounts."* 
8. Choose a platform: **Web**.
9. Set the **Redirect URI**: `http://localhost:3000/api/auth/callback/microsoft-entra-id`
10. Click **Register**.
11. Open your app under **All applications** — copy the **Application (client) ID** and **Directory (tenant) ID**.
12. Go to **Certificates & secrets** (Client credentials).
13. Click **New client secret**, then set a description and expiry.
14. Copy the secret **Value** (shown only once) into `AUTH_MICROSOFT_ENTRA_ID_SECRET` in `.env.local`.
