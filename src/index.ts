import './index.scss';

interface Data {
  a: number,
  b: string,
  c: boolean
}

const data: Data = {
  a: 1,
  b: '2',
  c: true
}

console.log('data:', data)

const app:HTMLElement = document.querySelector('#app');

const p:HTMLParagraphElement = document.createElement('p');

p.textContent = '我是动态创建的p标签';
p.classList.add('orange_font');

app.appendChild(p);
