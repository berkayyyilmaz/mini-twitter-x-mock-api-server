# Mini Twitter X - API Server

## How to run

### Install dependencies

```bash
npm install
```

### Run the server

```bash
npm run api
```

will run the server on `http://localhost:3001`

When you run the server, it will console log 3 predefined users. You can use one of them to login. You can also register a new user.

You can use the following user to login:

```bash
Predefined user: {
  id: '4iqOO',
  username: 'Tatum_Schneider',
  password: 'oaZSxaOPcQfzhF6',
  email: 'Marielle76@gmail.com',
  hashedPassword: '$2b$10$DVy/a7kxN...6BbZZh1O',
  token: 'eyJ...vd49g'
}
```

## Endpoints & Requests:

**Profile Authentication:**

| Method | URL                       | Desc     |
| ------ | ------------------------- | -------- |
| POST   | `${URL}/profile/register` | Register |
| POST   | `${URL}/profile/logout`   | Logout   |
| POST   | `${URL}/profile/login`    | Login    |

**Tweet İşlemleri:**

There urls are protected by authentication. You need to send `Authorization` header with `Bearer <token>` value.

| Method | URL                       | Description    |
| ------ | ------------------------- | -------------- |
| GET    | `${URL}/tweet/`           | Get All Tweets |
| GET    | `${URL}/tweet/id`         | Get a Tweet    |
| POST   | `${URL}/tweet`            | New Tweet      |
| PUT    | `${URL}/tweet/id`         | Edit Tweet     |
| DELETE | `${URL}/tweet/id`         | Delete Tweet   |
| POST   | `${URL}/tweet/like/id`    | Like           |
| DELETE | `${URL}/tweet/like/id`    | Unlike         |
| POST   | `${URL}/tweet/retweet/id` | Retweet        |
| POST   | `${URL}/tweet/reply/id`   | Comment        |
| DELETE | `${URL}/tweet/reply/id`   | Delete Comment |

## Dynamic Documentation

## [Profile](https://www.postman.com/warped-escape-979153/workspace/mini-twitter-x-mock-api/documentation/391613-69e7dcd3-f015-46fc-bfe6-ca07872f5c00)

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/391613-69e7dcd3-f015-46fc-bfe6-ca07872f5c00?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D391613-69e7dcd3-f015-46fc-bfe6-ca07872f5c00%26entityType%3Dcollection%26workspaceId%3D59104268-2598-42ee-bcde-aadc73db1540#?env%5BMini%20Twitter%20X%20WiT%20Mock%20API%5D=W3siZW5hYmxlZCI6dHJ1ZSwia2V5IjoidXJsIiwidmFsdWUiOiJodHRwczovLzcxNTI1Yjk5LTQ1NWEtNDViZS1iZmViLTFiOWU4Mjg0YzA4YS5tb2NrLnBzdG1uLmlvIiwidHlwZSI6InRleHQifV0=)

## [Tweet Management](https://www.postman.com/warped-escape-979153/workspace/mini-twitter-x-mock-api/documentation/391613-745c5287-8164-4db7-9c19-ce90608075c2)

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/391613-745c5287-8164-4db7-9c19-ce90608075c2?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D391613-745c5287-8164-4db7-9c19-ce90608075c2%26entityType%3Dcollection%26workspaceId%3D59104268-2598-42ee-bcde-aadc73db1540#?env%5BMini%20Twitter%20X%20WiT%20Mock%20API%5D=W3siZW5hYmxlZCI6dHJ1ZSwia2V5IjoidXJsIiwidmFsdWUiOiJodHRwczovLzcxNTI1Yjk5LTQ1NWEtNDViZS1iZmViLTFiOWU4Mjg0YzA4YS5tb2NrLnBzdG1uLmlvIiwidHlwZSI6InRleHQifV0=)
