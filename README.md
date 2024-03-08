# D4CR Keystone Server Installations Guide

## Konfigurera miljövariabler

- Skapa en .env-fil med nedanstående variabler och ange dina egna värden.

```
PORT=3000
BASE_URL = 'http://localhost:${PORT}/'
NEXT_API_URL = '${BASE_URL}api/graphql'
CORS_FRONTEND_ORIGIN=

# Session
SESSION_SECRET="myultrasecretstringmyultrasecretstring"
SESSION_MAX_AGE=2592000

# Database
HEROKU_POSTGRESQL_BROWN_URL=

# Storage
BUCKETEER_BUCKET_NAME=
BUCKETEER_AWS_REGION=
BUCKETEER_AWS_ACCESS_KEY_ID=
BUCKETEER_AWS_SECRET_ACCESS_KEY=

# Media
MEDIA_URL="${BASE_URL}public/media"
IMAGE_URL="${BASE_URL}public/images"

# Mail
## Development (Mailtrap)
EMAIL_USERNAME=yourusername
EMAIL_PASSWORD=yourpassword
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=465

EMAIL_FROM="your@email.com"

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_WEBOOKH_SIGN_SECRET=

```

## Mailtrap

- Gå till Mailtrap och skapa ett konto om du inte redan har ett.
- Efter att du har loggat in, skapa en ny inkorg genom att klicka på "Add Inbox" (Lägg till inkorg) och följ instruktionerna för att konfigurera den.
- När inkorgen är skapad, klicka på den för att få tillgång till dess inställningar.
- I inställningarna kommer du att hitta SMTP-serverinformation som du behöver för att fylla i din .env-fil. Notera användarnamn, lösenord, host och port.
- Återgå till din .env-fil och fyll i dina uppgifter under "# Mail":

## Skapa en Postgres databas lokalt

- Följ dessa steg för att skapa en Postgres-databas lokalt:
- Installera Postgres via [Download Postgres](https://postgresapp.com/downloads.html) om du inte redan har det.
- Skapa en ny databas via GUI.
- Uppdatera HEROKU_POSTGRESQL_BROWN_URL i .env.

## Start Keystone Js

- Använd följande kommando för att installera och starta din Keystone JS-server:

```
cd /backend
npm install
npm run dev

```
