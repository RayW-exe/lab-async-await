// Write your code here!

// fetch(`https://jsonplaceholder.typicode.com/posts`)
//    .then(response => response.json())
//    .then(data => {
//      console.log(data);
//      displayPosts(data)
//    })
//    .catch(error => {
//     console.log(error);
//    });



// function displayPosts(data){
//   const ulist = document.getElementById("post-list")
//   data.forEach(post => {
//     const list = document.createElement("li")
//     const heading = document.createElement("h1")
//     const paragraph = document.createElement("p")
//     heading.textContent = post.title
//     paragraph.textContent = post.body
//     list.appendChild(heading)
//     list.appendChild(paragraph)
    
//     ulist.appendChild(list)
//   });
// }

async function fetchPosts() {
    try{
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts`)
        const data = await response.json();

        displayPosts(data);
    }
    catch (error){
        console.log(error)
    }
}

fetchPosts()

function displayPosts(data){
  const ulist = document.getElementById("post-list")
  data.forEach(post => {
    const list = document.createElement("li")
    const heading = document.createElement("h1")
    const paragraph = document.createElement("p")
    heading.textContent = post.title
    paragraph.textContent = post.body
    list.appendChild(heading)
    list.appendChild(paragraph)
    
    ulist.appendChild(list)
  });
}