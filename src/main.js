import { PREP_TIME } from './js/menu';

const formElement = document.querySelector('.form');
const logListElement = document.querySelector('.order-log');

function makeOrder(delay, shouldResolve) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldResolve) {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });
}

function addOrderRow(drink) {
  const li = document.createElement('li');
  li.className = 'row-pending';
  li.textContent = `⏳ ${drink} · у роботі…`;
  logListElement.appendChild(li);
  return li;
}

formElement.addEventListener('submit', event => {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const drink = formData.get('drink');
  const state = formData.get('state');

  const delay = PREP_TIME[drink];
  const shouldResolve = state === 'fulfilled';

  const row = addOrderRow(drink);

  makeOrder(delay, shouldResolve)
    .then(delayTime => {
      row.className = 'row-ok';
      row.textContent = `✅ ${drink} · готове · ${delayTime} ms`;
    })
    .catch(delayTime => {
      row.className = 'row-err';
      row.textContent = `❌ ${drink} · скасовано · ${delayTime} ms`;
    })
    .finally(() => {
      const endTime = new Date().toLocaleTimeString('uk-UA');
      row.textContent += ` · ${endTime}`;
    });
});
