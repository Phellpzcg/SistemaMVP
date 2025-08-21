document.addEventListener('DOMContentLoaded', async () => {
  loadSession();
  const res = await fetch('/api/app/hello');
  if(res.ok){
    const data = await res.json();
    document.getElementById('hello').textContent = data.message || JSON.stringify(data);
  }
});
