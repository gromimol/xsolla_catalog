document.addEventListener('DOMContentLoaded', function() {
    // Находим все заголовки аккордеона
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    // Открываем первый элемент аккордеона по умолчанию
    const firstItem = document.querySelector('.accordion-item');
    if (firstItem) {
      firstItem.classList.add('active');
    }
    
    // Добавляем обработчик клика для каждого заголовка
    accordionHeaders.forEach(header => {
      header.addEventListener('click', function() {
        // Находим родительский элемент (accordion-item)
        const parentItem = this.parentElement;
        
        // Проверяем, активен ли данный элемент
        const isActive = parentItem.classList.contains('active');
        
        // Сначала закрываем все активные элементы
        const allItems = document.querySelectorAll('.accordion-item');
        allItems.forEach(item => {
          item.classList.remove('active');
        });
        
        // Если элемент не был активен, делаем его активным
        if (!isActive) {
          parentItem.classList.add('active');
        }
      });
    });
  });
$(document).ready(function() {

    $('.has-submenu').on('click', function(e) {
        $(this).toggleClass('active');
      })
  
      $('.burger').on('click',function() {
        $('body').addClass('menu-open');
      })
      $('.close').on('click',function() {
        $('body').removeClass('menu-open');
      })
    
    $('.js--scroll-to-unlock').on('click', function(e) {
        e.preventDefault();
        const $targetElement = $('.card-wrapper');
        
        if ($targetElement.length) {
            const targetPosition = $targetElement.offset().top;
            
            // Небольшой отступ сверху
            const offset = 20;
            
            $('html, body').animate({
                scrollTop: targetPosition - offset
            }, 800);
        }
    });

    // Сначала скрываем элементы
    const $heading = $('.first-screen__content .h1');
    const $subtitle = $('.first-screen__content .first-screen__subtitle');
    const $btnsContainer = $('.first-screen__content .btns-container');
    
    // Устанавливаем начальные стили
    $heading.css({
        'opacity': 0,
        'transform': 'translateY(30px)',
        'transition': 'opacity 0.8s ease, transform 0.8s ease'
    });
    
    $subtitle.css({
        'opacity': 0,
        'transform': 'translateY(30px)',
        'transition': 'opacity 0.8s ease, transform 0.8s ease',
        'transition-delay': '0.2s' // Небольшая задержка для эффекта каскада
    });
    
    $btnsContainer.css({
        'opacity': 0,
        'transform': 'translateY(30px)',
        'transition': 'opacity 0.8s ease, transform 0.8s ease',
        'transition-delay': '0.4s' // Еще большая задержка
    });
    
    // Запускаем анимацию через 1 секунду после загрузки страницы
    setTimeout(function() {
        $heading.css({
            'opacity': 1,
            'transform': 'translateY(0)'
        });
        
        $subtitle.css({
            'opacity': 1,
            'transform': 'translateY(0)'
        });
        
        $btnsContainer.css({
            'opacity': 1,
            'transform': 'translateY(0)'
        });
    }, 1000);

    const CARDS_PER_PAGE = 9;
    let currentPage = 1;
    let currentFilter = 'all';
    let allCards = [];
    let filteredCards = [];
    
    // Собираем все карточки из DOM в наш массив
    function initializeCards() {
        allCards = [];
        $('.card-list .card').each(function(index) {
            const $card = $(this);
            const cardTopTitle = $card.find('.card__top__title').text().trim();
            const cardBodyTitle = $card.find('.card__body__row__content .title').text().trim();
            
            const cardCategory = $card.data('category');
            const categories = ['all', cardCategory];
            
            // Сохраняем данные карточки
            allCards.push({
                element: $card,
                topTitle: cardTopTitle,
                bodyTitle: cardBodyTitle,
                categories: categories,
                visible: false,
                index: index
            });
            
            // Удаляем карточку из DOM (мы покажем их позже)
            $card.detach();
        });
        
        filteredCards = [...allCards];
    }
    
    // Отображаем видимые карточки
    function renderCards() {
        const $cardList = $('.card-list');
        const $noResults = $('.no-results');
        
        // Если нет карточек, соответствующих фильтрам, показываем "No results found"
        if (filteredCards.length === 0) {
            $cardList.empty();
            
            // Показываем блок "No results found"
            $noResults.show();
            
            // Скрываем кнопку "Load more"
            $('.load-more-wrapper').hide();
            return;
        }
        
        // Скрываем блок "No results found"
        $noResults.hide();
        
        // Определяем, какие карточки показывать (только текущая страница)
        const startIndex = 0;
        const endIndex = Math.min(currentPage * CARDS_PER_PAGE, filteredCards.length);
        const visibleCards = filteredCards.slice(startIndex, endIndex);
        
        // Очищаем текущий список карточек
        $cardList.empty();
        
        // Добавляем видимые карточки в DOM
        visibleCards.forEach(card => {
            $cardList.append(card.element);
        });
        
        // Скрываем/показываем кнопку "Load more" в зависимости от наличия еще карточек
        if (endIndex >= filteredCards.length) {
            $('.load-more-wrapper').hide();
        } else {
            $('.load-more-wrapper').show();
        }
    }
    
    // Фильтруем карточки на основе категории и поискового запроса
    function filterCards() {
        const searchQuery = $('.search-field__input').val().toLowerCase();
        
        filteredCards = allCards.filter(card => {
            // Фильтр по категории
            const categoryMatch = currentFilter === 'all' || card.categories.includes(currentFilter);
            
            // Фильтр по заголовку в теле карточки (.title)
            const bodyTitleMatch = card.bodyTitle.toLowerCase().includes(searchQuery);
            const searchMatch = searchQuery === '' || bodyTitleMatch;
            
            return categoryMatch && searchMatch;
        });
        
        // Сбрасываем на первую страницу при изменении фильтров
        currentPage = 1;
        
        // Если есть поисковый запрос, подсвечиваем результаты
        if (searchQuery) {
            // Сначала вернем оригинальный текст всем карточкам
            allCards.forEach(card => {
                const $titleElement = card.element.find('.card__body__row__content .title');
                $titleElement.html(card.bodyTitle);
            });
            
            // Затем подсветим текст в отфильтрованных карточках
            filteredCards.forEach(card => {
                const $titleElement = card.element.find('.card__body__row__content .title');
                const originalText = card.bodyTitle;
                const regex = new RegExp('(' + searchQuery + ')', 'gi');
                const highlightedText = originalText.replace(regex, '<span class="highlight">$1</span>');
                $titleElement.html(highlightedText);
            });
        } else {
            // Если поискового запроса нет, вернем оригинальный текст
            allCards.forEach(card => {
                const $titleElement = card.element.find('.card__body__row__content .title');
                $titleElement.html(card.bodyTitle);
            });
        }
        
        // Перерисовываем карточки
        renderCards();
    }
    
    // Инициализируем данные карточек
    initializeCards();
    
    // Обработчик клика на кнопки сортировки
    $('.sort-btns .btn').on('click', function() {
        const $btn = $(this);
        const filterValue = $btn.data('filter') || $btn.text().trim().toLowerCase().replace(/\s+/g, '-');
        
        // Обновляем состояние активной кнопки
        $('.sort-btns .btn').removeClass('active');
        $btn.addClass('active');
        
        // Обновляем текущий фильтр
        currentFilter = filterValue;
        
        // Применяем фильтры
        filterCards();
    });
    
    // Обработчик ввода в поле поиска
    $('.search-field__input').on('input', function() {
        filterCards();
    });
    
    // Обработчик кнопки "Load more"
    $('.load-more').on('click', function() {
        const $loadMoreBtn = $(this);
        
        // Запоминаем оригинальное содержимое кнопки
        const originalHtml = $loadMoreBtn.html();
        
        // Показываем состояние загрузки
        $loadMoreBtn.addClass('loading');
        $loadMoreBtn.html('Loading <div class="spinner"></div>');
        
        // Имитируем задержку загрузки (1 секунда)
        setTimeout(function() {
            // Увеличиваем страницу
            currentPage++;
            
            // Отображаем карточки
            renderCards();
            
            // Сбрасываем состояние кнопки
            $loadMoreBtn.removeClass('loading');
            $loadMoreBtn.html(originalHtml);
        }, 1000); // Задержка 1 секунда
    });
    
    // Инициализация с фильтром "all" по умолчанию
    currentFilter = 'all';
    
    // Отображаем первую страницу карточек
    renderCards();
});

// animations for orbs
window.addEventListener("load", () => {
    // Получаем видео-элемент для всех шаров
    const sourceVideo = document.getElementById("sourceVideoBall");
    
    // Сначала скрываем все шары, чтобы не было видно черных пятен
    document.querySelectorAll("[data-ball]").forEach(element => {
      element.style.opacity = "0";
      element.style.transition = "all 1s ease";
      element.style.visibility = "hidden";
    });
    
    // Настраиваем шары
    function setupBalls() {
      // Найти все элементы с атрибутом data-ball
      document.querySelectorAll("[data-ball]").forEach((element, index) => {
        // Пропускаем слишком маленькие элементы
        if (element.clientWidth < 5) return;
        
        // Создаем canvas элемент с высоким DPI для лучшего качества
        const canvas = document.createElement("canvas");
        const pixelRatio = window.devicePixelRatio || 1;
        
        const gl = canvas.getContext("webgl2", {
          antialias: true,
          alpha: true
        }) || canvas.getContext("webgl", {
          antialias: true,
          alpha: true
        });
        
        // Если WebGL не поддерживается, пропускаем
        if (!gl) return;
        
        // Настраиваем canvas с учетом pixelRatio для лучшего качества
        canvas.style.opacity = "0";
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.classList.add("transition-opacity", "duration-5000");
        
        // Устанавливаем размер canvas с учетом pixel ratio для четкости
        const size = element.clientWidth;
        canvas.width = size * pixelRatio;
        canvas.height = size * pixelRatio;
        
        // Создаем обертку для canvas
        const wrapper = document.createElement("div");
        wrapper.style.width = "100%";
        wrapper.style.height = "100%";
        wrapper.style.position = "relative";
        wrapper.appendChild(canvas);
        
        // Заменяем содержимое элемента оберткой
        element.replaceChildren(wrapper);
        
        // Добавляем случайный начальный поворот с помощью jQuery
        const initialRotation = Math.floor(Math.random() * 360) - 180; // От -180 до +180 градусов
        $(element).css({
            'transform': `rotate(${initialRotation}deg)`,
            'transform-origin': 'center center'
        });
        
        // Получаем время начала для этого шара
        const startTime = element.hasAttribute("data-start-time") 
          ? parseFloat(element.getAttribute("data-start-time"))
          : Math.random() * 10; // Случайное время, если не указано
            
        // Сохраняем смещение времени
        canvas.timeOffset = startTime;
        
        // Устанавливаем текущее время видео для этого шара
        if (sourceVideo && sourceVideo.readyState >= 2) {
          sourceVideo.currentTime = startTime % sourceVideo.duration;
        }
        
        // Создаем WebGL текстуру с улучшенными параметрами
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        
        // Создаем вершинный шейдер
        const vertexShaderSource = `
          precision highp float;
          attribute vec2 a_position;
          attribute vec2 a_texCoord;
          varying vec2 v_texCoord;
          void main() {
            gl_Position = vec4(a_position, 0.0, 1.0);
            v_texCoord = a_texCoord;
          }
        `;
        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vertexShaderSource);
        gl.compileShader(vertexShader);
        
        // Создаем улучшенный фрагментный шейдер для более гладкого круга
        const fragmentShaderSource = `
          precision highp float;
          varying vec2 v_texCoord;
          uniform sampler2D u_texture;
          uniform float u_padding;
          
          void main() {
            vec2 centeredCoord = v_texCoord * 2.0 - 1.0; // Convert to -1..1
            float radius = 1.0 + u_padding; // Make the circle wider
            
            // Улучшенная гладкость краев с антиалиасингом
            float distFromCenter = length(centeredCoord);
            float smoothEdge = 0.01;
            float alpha = 1.0 - smoothstep(radius - smoothEdge, radius, distFromCenter);
            
            if (alpha <= 0.0) discard; // Cut out the circle
            
            vec4 color = texture2D(u_texture, v_texCoord);
            gl_FragColor = vec4(color.rgb, color.a * alpha);
          }
        `;
        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fragmentShaderSource);
        gl.compileShader(fragmentShader);
        
        // Проверка на ошибки компиляции шейдеров
        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
          console.error('Ошибка вершинного шейдера:', gl.getShaderInfoLog(vertexShader));
          return;
        }
        
        if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
          console.error('Ошибка фрагментного шейдера:', gl.getShaderInfoLog(fragmentShader));
          return;
        }
        
        // Создаем и связываем шейдерную программу
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
          console.error('Ошибка линковки программы:', gl.getProgramInfoLog(program));
          return;
        }
        
        gl.useProgram(program);
        
        // Масштабируем viewport с учетом pixel ratio
        gl.viewport(0, 0, canvas.width, canvas.height);
        
        // Создаем буфер для прямоугольника, который покажет текстуру
        const positionBuffer = gl.createBuffer();
        const positions = new Float32Array([
          -1, -1,  0, 0,  // bottom left
          1, -1,  1, 0,  // bottom right
          -1,  1,  0, 1,  // top left
          1,  1,  1, 1   // top right
        ]);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
        
        // Настраиваем атрибут положения
        const positionLocation = gl.getAttribLocation(program, "a_position");
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 16, 0);
        
        // Настраиваем атрибут текстурных координат
        const texCoordLocation = gl.getAttribLocation(program, "a_texCoord");
        gl.enableVertexAttribArray(texCoordLocation);
        gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 16, 8);
        
        // Устанавливаем uniform для отступа (для края круга)
        const paddingLocation = gl.getUniformLocation(program, "u_padding");
        gl.uniform1f(paddingLocation, -0.02); // Улучшенный параметр для более гладких краев
        
        // Включаем расширенную фильтрацию текстур для лучшего качества
        const ext = gl.getExtension("EXT_texture_filter_anisotropic");
        if (ext) {
          const max = gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
          gl.texParameterf(gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, max);
        }
        
        // Включаем смешивание для создания прозрачных краев
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        
        // Функция анимации для обновления canvas с кадрами видео
        function render() {
          if (!gl) return;
          
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sourceVideo);
          
          gl.clear(gl.COLOR_BUFFER_BIT);
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
          
          requestAnimationFrame(render);
        }
        
        // Обработка изменения размера
        function handleResize() {
          if (!gl) return;
          
          const newSize = element.clientWidth;
          canvas.width = newSize * pixelRatio;
          canvas.height = newSize * pixelRatio;
          
          gl.viewport(0, 0, canvas.width, canvas.height);
        }
        
        window.addEventListener("resize", handleResize);
        handleResize();
        render();
        canvas.style.opacity = "1";
      });
    }
    
    // Функция для плавного отображения шаров
    function showBalls() {
      setTimeout(() => {
        document.querySelectorAll("[data-ball]").forEach((element, index) => {
          setTimeout(() => {
            element.style.visibility = "visible";
            element.style.opacity = "1";
            
            const canvas = element.querySelector("canvas");
            if (canvas) {
              canvas.style.opacity = "1";
            }
          }, index * 100);
        });
      }, 1000);
    }
    
    // Запускаем видео и настраиваем шары
    if (sourceVideo) {
      sourceVideo.addEventListener("loadedmetadata", () => {
        sourceVideo.play().catch(error => {
          console.log("Автовоспроизведение невозможно:", error);
          
          setupBalls();
          showBalls();
        });
        
        setupBalls();
        
        // Показываем шары когда видео готово
        showBalls();
      });
      
      if (sourceVideo.readyState >= 3) { // HAVE_FUTURE_DATA или HAVE_ENOUGH_DATA
        setupBalls();
        sourceVideo.play().catch(error => {
          console.log("Автовоспроизведение невозможно:", error);
        });
        showBalls();
      }
  
      sourceVideo.load();
    }
  });