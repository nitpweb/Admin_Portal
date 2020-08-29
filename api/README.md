# Direction for usage of API

BASE_URL = `https://nitpadmin.herokuapp.com`  

## Available routes : 
### 1. `/api/notice` 
This route can be used to get all the notices in the institute  
For example :  
```js
fetch(`${BASE_URL}/api/notice`)
.then(res => {
    // log the response from the server
    console.log(res)
})
.catch(err => {
    console.log(err)
})
```

<br/>

### 2. `api/notice/active`
This route can be used to get all the visible notices in the institute  
For example :  
```js
fetch(`${BASE_URL}/api/notice/active`)
.then(res => {
    // log the response from the server
    console.log(res)
})
.catch(err => {
    console.log(err)
})
```

<br/>

### 3. `api/notice/archive`
This route can be used to get all the archived (not active) notices in the institute  
For example :  
```js
fetch(`${BASE_URL}/api/notice/archive`)
.then(res => {
    // log the response from the server
    console.log(res)
})
.catch(err => {
    console.log(err)
})
```