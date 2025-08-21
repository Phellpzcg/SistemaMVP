document.addEventListener('DOMContentLoaded', () => {
  loadSession();
  document.getElementById('create-form').addEventListener('submit', createUser);
  document.getElementById('users').addEventListener('click', handleTableClick);
  fetchUsers();
});

async function fetchUsers(){
  const res = await fetch('/api/users');
  if(res.ok){
    const users = await res.json();
    renderUsers(users);
  }
}

function renderUsers(users){
  const tbody = document.querySelector('#users tbody');
  tbody.innerHTML = '';
  users.forEach(u => {
    const tr = document.createElement('tr');
    tr.dataset.id = u.id;
    tr.innerHTML = `<td><input class="username" value="${u.username}"></td>`+
                    `<td><input class="email" value="${u.email}"></td>`+
                    `<td><button class="update">Atualizar</button> <button class="delete">Excluir</button></td>`;
    tbody.appendChild(tr);
  });
}

async function createUser(e){
  e.preventDefault();
  const username = document.getElementById('new-username').value;
  const email = document.getElementById('new-email').value;
  const password = document.getElementById('new-password').value;
  await fetch('/api/users', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({username, email, password})
  });
  e.target.reset();
  fetchUsers();
}

async function handleTableClick(e){
  const tr = e.target.closest('tr');
  if(!tr) return;
  const id = tr.dataset.id;
  if(e.target.classList.contains('delete')){
    await fetch(`/api/users/${id}`, {method:'DELETE'});
    fetchUsers();
  }
  if(e.target.classList.contains('update')){
    const username = tr.querySelector('.username').value;
    const email = tr.querySelector('.email').value;
    await fetch(`/api/users/${id}`, {
      method:'PUT',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({username, email})
    });
    fetchUsers();
  }
}
