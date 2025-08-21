async function loadSession(){
  try{
    const res = await fetch('/api/auth/session');
    if(!res.ok) throw new Error('no session');
    const data = await res.json();
    const span = document.getElementById('user-name');
    if(span && data.user){
      span.textContent = data.user.name || data.user.username || '';
    }
  }catch(err){
    window.location.href = '/index.html';
  }
}

async function logout(){
  try{ await fetch('/api/auth/logout',{method:'POST'}); }catch(err){}
  window.location.href = '/index.html';
}

window.loadSession = loadSession;
window.logout = logout;

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('logout');
  if(btn) btn.addEventListener('click', logout);
  if(document.getElementById('user-name')) loadSession();
});
