let tooltipElem;

export default function tooltipText(d) {
  if (d.data.field) {
    return `Название: ${d.data.field} <br>Описание: ${d.data.description} <br>Оператор: ${d.data.operator} <br>Значение: ${d.data.value} <br>Результат: ${d.data.count}`;
  }
  if (d.data.result || d.data.comment) {
    return '';
  }
  return `Результат: ${d.data.count}`;
}

document.onmouseover = (event) => {
  const { target } = event;

  // если у нас есть подсказка...
  const tooltipHtml = target.dataset.tooltip;
  if (!tooltipHtml) { return; }

  // ...создадим элемент для подсказки
  tooltipElem = document.createElement('div');
  tooltipElem.className = 'tooltip';
  tooltipElem.innerHTML = tooltipHtml;
  document.body.append(tooltipElem);

  // спозиционируем его сверху от аннотируемого элемента (top-center)
  const coords = target.getBoundingClientRect();
  let left = coords.left + (target.offsetWidth - tooltipElem.offsetWidth) / 2;
  if (left < 0) { left = 0; } // не заезжать за левый край окна

  let top = coords.top - tooltipElem.offsetHeight - 5;
  if (top < 0) { // если подсказка не помещается сверху, то отображать её снизу
    top = coords.top + target.offsetHeight + 5;
  }

  tooltipElem.style.left = `${left}px`;
  tooltipElem.style.top = `${top}px`;
};

document.onmouseout = () => {
  if (tooltipElem) {
    tooltipElem.remove();
    tooltipElem = null;
  }
};
