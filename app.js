(() => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js'));
  }

  const smtng = [...document.querySelectorAll('.num')];
  const result = document.querySelector('#resultData');
  const calculator = document.querySelector("#calculator");
  const displayInstaller = document.querySelector("#dinstall");
  const operatorHistory = [];
  let operatorString = '';
  let historyIndex = 0;
  let deferredPrompt;

  displayInstaller.style.display = 'none';
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    displayInstaller.style.display = 'block';
    displayInstaller.addEventListener('click', (e) => {
      displayInstaller.style.display = 'none';
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => deferredPrompt = null);
    });
  });

  smtng.forEach(element => {
    element.addEventListener('click', () => {

      if (element.textContent === 'AC') {
        result.value = '';
        operatorString = '';
        return;
      }

      if (element.textContent === 'fn(x)') {
        let v = result.value.toLowerCase().trim();
        draw(v);
        return;
      }

      if (element.getAttribute('data-operator') === '=') {
        let v = result.value.toLowerCase().trim();
        if (v === '') return;
        try {
          with (Math) {
            operatorHistory.push(v);
            v = eval(v);
          }
          result.value = v;
          operatorString = '';
        } catch (error) {
          alert('invalid operator !');
          result.value = '';
          operatorString = '';
          operatorHistory.pop();
        }
      } else {
        let v = element.textContent.trim().toLowerCase() || element.getAttribute('data-operator');
        operatorString += /sin|cos|tan/g.test(v) ? `${v}(` : v;
        result.value = operatorString;
      }

      if (element.getAttribute('data-operator') === 'memo') {
        operatorString = '';
        result.value = operatorHistory[historyIndex++] || '';
      }
    });
  });

  result.addEventListener('input', ({ inputType }) => inputType === 'deleteContentBackward'
    && (operatorString = result.value));

  document.querySelector('#light').addEventListener('click', () => theme('dark', 'light'));

  document.querySelector('#dark').addEventListener('click', () => theme('light', 'dark'));

  const theme = (_, __) => {
    calculator.classList.remove(_);
    calculator.classList.add(__);
  }

  function draw(v) {
    try {
      const expr = math.compile(v);
      const xValues = math.range(-10, 10, 0.5).toArray();
      const yValues = xValues.map(function (x) {
        return expr.evaluate({ x: x });
      })
      const trace1 = {
        x: xValues,
        y: yValues,
        type: 'scatter'
      }
      const data = [trace1];
      Plotly.newPlot('plot', data);
    }
    catch (err) {
      alert('something went wrong');
    }
  }
})
  ();