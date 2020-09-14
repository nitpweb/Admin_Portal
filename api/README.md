# Direction for usage of API

BASE_URL = `https://nitpadmin.herokuapp.com`

## Available routes :

### 1. `/api/notice`

This route can be used to get all the notices in the institute  
For example :

```js
fetch(`${BASE_URL}/api/notice`)
  .then((res) => {
    // log the response from the server
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
```

<br/>

### 2. `/api/notice/active`

This route can be used to get all the visible notices in the institute  
For example :

```js
fetch(`${BASE_URL}/api/notice/active`)
  .then((res) => {
    // log the response from the server
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
```

Response

```json
[
  {
    "id": 1598709975846,
    "title": "first notice",
    "timestamp": 1598712753805,
    "attachments": [
      {
        "caption": "well well",
        "url": "https://drive.google.com/file/d/13aL6hsRWdWM-bhk3ufkJp2N9MrzkFObW/view?usp=drivesdk"
      }
    ]
  }
]
```

<br/>

### 3. `/api/notice/archive`

This route can be used to get all the archived (not active) notices in the institute  
For example :

```js
fetch(`${BASE_URL}/api/notice/archive`)
  .then((res) => {
    // log the response from the server
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
```

<br>

### 4. `/api/notice/faculty`

This route can be used to get the about-info of all the faculties in the institute  
For example :

```js
fetch(`${BASE_URL}/api/faculty`)
  .then((res) => {
    // log the response from the server
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
```

<br>

### 5. `/api/notice/faculty/:facultyid`

This route can be used to get the full profile of the faculty whose id is provided as parameter
For example :

```js
fetch(`${BASE_URL}/api/faculty/1000`)
  .then((res) => {
    // log the response from the server
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
```

Response

```json
{
    "profile": {
        "id": 1000,
        "name": "Kumar Harsh",
        "email": "intelligentharsh007@gmail.com",
        "role": 1,
        "department": "Computer Science and Engineering",
        "designation": "Professor",
        "ext_no": 1234,
        "research_interest": "Computer Science",
        "imgUrl": "/profile/image?id=1000"
    },
    "subjects": [
        "Introduction to computing",
        "Chemistry"
    ],
    "memberships": [2 items],
    "qualification": [3 items],
    "currResponsibility": [1 item],
    "pastreponsibility": [1 item],
    "books": [],
    "journals": [8 items],
    "conferences": [11 items],
    "projects": [1 item],
    "services": [2 items],
    "workExperience": [2 items],
    "phdCandidates": [1 item]
}
```
