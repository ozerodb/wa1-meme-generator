# Exam #2: "Meme Generator"

## Student: s292425 BONACCORSI DAMIANO

## React Client Application Routes

- Route `/memes`: home page with list of memes
- Route `/create`: page to create a meme (new or copy) for authenticated users (nb: in this application, users are creators, there is no admins or other types of users)
- Route `/login`: login page

## API Server

- POST `/api/sessions`

  - request body:

    ```json
    {
      "username": "ozerodb@outlook.com",
      "password": "password"
    }
    ```

  - response: `200 OK` (success) or `401 not authorized`.
  - response body:

    ```json
    {
      "id": "1",
      "username": "ozerodb@outlook.com",
      "name": "ozerodb"
    }
    ```

- DELETE `/api/sessions/current`
  - request parameters and request body: _None_
  - response: `200 OK` (success) or `401 not authorized`.
  - response body: _None_
- GET `/api/sessions/current`

  - request parameters and request body: _None_
  - response: `200 OK` (success) or `401 not authorized`.
  - response body:

    ```json
    {
      "id": "1",
      "username": "ozerodb@outlook.com",
      "name": "ozerodb"
    }
    ```

- GET `/api/memes`
  - request parameters and request body: _None_
  - response body:

    ```json
    [{"id":"1",
      "username": "ozerodb@outlook.com",
      "name": "ozerodb"}]
    ```

- DELETE `/api/memes/:id`
  - request parameter: _meme's id_
  - response: `200 OK` (success) or `401 not authorized`.
  - response body: _None_
- POST `/api/new_meme`
  - request body:
  - response body: _None_

## Database Tables

- Table `users` - contains users' `id`, `name`, `email`, `password` (hashed)
- Table `memes` - contains memes' `id`, `title`, `creatorId`, `templateId`, `isPublic`, `text1`, `text2`, `text3`, `color`, `fontFamily`

## Main React Components

- `Meme` (in `meme.js`): this component takes as props the info about a meme (including the template info) and returns an image with overlaid texts.
- `MemeModal` (in `meme.js`): this component takes as props the info about a meme (including the template info) and return a Modal with a Meme component inside.
- `MemesList` (in `meme.js`): this component takes as props an array of memes' info, and the info about the current user. It returns a list of items including the meme's title and creator, and if the user is authenticated it includes the meme's visibility and the utility buttons.
- `MemeCreator` (in `meme.js`): this component takes as props an array of templates, and the info about the current user. It returns an editor consisting of a Meme component on the left, to be used as a preview, and a form on the right, to be used to modify the meme. If the location.prefill hook is defined, the MemeCreator works in copy mode.

## Screenshot

- Login
![Login](./img/login.jpg)

- Memes (non-authenticated user)
![Memes no-auth](./img/memes_no_auth.jpg)

- Memes (authenticated user)
![Memes no-auth](./img/memes_auth.jpg)

- New Meme
![New Meme](./img/meme_new.jpg)

- New Meme
![New Meme](./img/meme_copy.jpg)

## Users Credentials

- `ozerodb@outlook.com`, `password`
- `john.doe@gmail.com`, `password`
- `mario.rossi@polito.it`, `password`
````
