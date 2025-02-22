checkTimer();

function setTime() {
  const timeLine = document.querySelector('.all-time');
  const calories = document.querySelector('.calories');

  const time = Math.floor((localStorage.getItem('timer') || 0) / 60);
  const burntCalories = localStorage.getItem('burntCalories') || 0;

  timeLine.innerText = `${time || 0} min`;
  calories.innerText = Math.floor(Number(burntCalories) / 1000 || 0).toString();

  if (time > 110) timeLine.style.color = 'green';
}

setTime();

export default setTime;


function checkTimer() {
  const lastUpdate = localStorage.getItem('lastUpdate');
  const today = new Date().toDateString();
  if (lastUpdate === today) return;

  localStorage.setItem('lastUpdate', today);
  localStorage.setItem('timer', 0);
  localStorage.setItem('burntCalories', 0);
}