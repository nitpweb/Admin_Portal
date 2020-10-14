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

### 5. `/api/faculty/:dept`

This route can be used to get the about info of the faculty whose of respective departments
The dept can take values as :
{
arch:Architecture
che:Chemistry
ce: Civil Engineering
cse: Computer Science and Engineering
ee: Electrical Engineering
ece: Electronics and Communication Engineering
hss: Humanities & Social Sciences
maths:Mathematics
me: Mechanical Engineering
phy: Physics
}

For example :

```js
fetch(`${BASE_URL}/api/faculty/cse`)
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
  "faculties": [
    {
      "id": 1000,
      "name": "Kumar Harsh",
      "email": "intelligentharsh007@gmail.com",
      "role": 1,
      "department": "Computer Science and Engineering",
      "designation": "Professor",
      "ext_no": 1234,
      "research_interest": "Computer Science",
      "imgUrl": "profile/image?id=1000"
    },
    {
      "id": 1001,
      "name": "Kumar Harsh",
      "email": "intharsh2605@gmail.com",
      "role": 2,
      "department": "Computer Science and Engineering",
      "designation": "Assossiate Professor",
      "ext_no": 4565,
      "research_interest": "Deep Learning, Ontology",
      "imgUrl": "profile/image?id=1001"
    }
  ]
}
```

### 6. `/api/faculty/:dept?id={facultyId}`

To view the full profile of the faculty, specify the id parameter with faculty id.

For example :

```js
fetch(`${BASE_URL}/api/faculty/cse?id=1000`)
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

  "memberships": [

      {
         "membership_id": "12123123",
         "membership_society": "IEEE"
      },
      {
         "membership_id": "qwwee22",
         "membership_society": "ASME"
      }
  ],

  "qualification": [.. 3 Items ..],

  "currResponsibility": [.. 1 Items ..],

  "pastreponsibility": [.. 1 Items ..],

  "books": [.. 0 Items ..],

  "journals": [.. 8 Items ..],

  "conferences": [.. 11 Items ..],

  "projects": [.. 1 Items ..],

  "services": [.. 2 Items ..],

  "workExperience": [.. 2 Items ..],

  "phdCandidates": [.. 1 Items ..]
}
```
