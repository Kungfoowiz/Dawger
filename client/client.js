const form = document.querySelector('form');
const errorElement = document.querySelector('.error-message');
const loadingElement = document.querySelector('.loading');
const woofElement = document.querySelector('.woofs');
const API_URL = 'http://localhost:5000/woofs';

errorElement.style.display = 'none';




listAllWoofs();





form.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const name = formData.get('name');
  const content = formData.get('content');
  const avatar = formData.get('avatar');

  if (name.trim() && content.trim()) {
    errorElement.style.display = 'none';
    form.style.display = 'none';
    loadingElement.style.display = '';

    const woof = {
      name,
      content,
      avatar
    };
    
    fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify(woof),
      headers: {
        'content-type': 'application/json'
      }
    }).then(response => {      
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType.includes('json')) {
          return response.json().then(error => Promise.reject(error.message));
        } else {
          return response.text().then(message => Promise.reject(message));
        }
      }
    }).then(() => {
      form.reset();
      setTimeout(() => {
        form.style.display = '';
      }, 300);
      listAllWoofs();
    }).catch(errorMessage => {
      form.style.display = '';
      errorElement.textContent = errorMessage;
      errorElement.style.display = '';
      loadingElement.style.display = 'none';
    });
  } else {
    errorElement.textContent = 'Name and content are required!';
    errorElement.style.display = '';
  }
});



function listAllWoofs() {
  
  woofElement.innerHTML = '';
  
  fetch(API_URL)

    .then(response => response.json())
    
    .then(woofs => {

      if(woofs !== undefined){
        woofs.reverse();
        woofs.forEach(woof => {
          const div = document.createElement('div');

          const header = document.createElement('h3');
          header.textContent = woof.name;

          const contents = document.createElement('p');
          contents.textContent = woof.content;

          const date = document.createElement('small');
          date.textContent = new Date(woof.created);

          div.appendChild(header);
          div.appendChild(contents);
          div.appendChild(date);

          woofElement.appendChild(div);
        });
        loadingElement.style.display = 'none';
      }

    });

}