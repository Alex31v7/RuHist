document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('feedback-form');
  const nameInput = document.getElementById('name');
  const messageEl = document.getElementById('form-message');

  if (!form) return;

  const savedName = localStorage.getItem('userName');
  if (savedName) {
    nameInput.value = savedName;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (name && email && message) {
      localStorage.setItem('userName', name);

      messageEl.textContent = 'Спасибо за ваше сообщение! (Демонстрация — данные не отправляются)';
      messageEl.style.color = '#2a7f2a';

      document.getElementById('email').value = '';
      document.getElementById('message').value = '';
    } else {
      messageEl.textContent = 'Пожалуйста, заполните все поля.';
      messageEl.style.color = '#c43c3c';
    }
  });
});
