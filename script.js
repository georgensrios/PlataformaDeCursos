// ==========================================================================
// 0. MASSA DE DADOS ACADÊMICA (MOCK DATA) openLesson
// ==========================================================================
const courseData = [
    {
        id: "mod-1",
        title: "Introdução ao Desenvolvimento Web",
        lessons: [
            { id: "l-1", title: "Como a Internet funciona", videoUrl: "assets/Videos/ComoInternetFunciona.mp4"},
            { id: "l-2", title: "Configurando o ambiente de desenvolvimento", videoUrl: "assets/Videos/ConfigAmbienteDesen.mp4"},
            { id: "l-3", title: "Sua primeira página HTML", videoUrl: "assets/Videos/PrimeiraPaginaHTML.mp4"}
        ]
    },
    {
        id: "mod-2",
        title: "Estilização Avançada com CSS",
        lessons: [
            { id: "l-4", title: "Dominando o CSS Flexbox", videoUrl: "assets/Videos/DominandoFlexbox.mp4"},
            { id: "l-5", title: "Layouts modernos com CSS Grid", videoUrl: "assets/Videos/LayoutsGrid.mp4"},
            { id: "l-6", title: "Responsividade e Conceitos Mobile-First", videoUrl: "assets/Videos/MobileFirst.mp4"}
        ]
    },
    {
        id: "mod-3",
        title: "Lógica de Programação com JavaScript",
        lessons: [
            { id: "l-7", title: "Variáveis, Tipos de Dados e Operadores", videoUrl: "assets/Videos/VariáveisOperadores.mp4"},
            { id: "l-8", title: "Estruturas de Condição e Repetição", videoUrl: "assets/Videos/Estr.CondiçãoRepetição.mp4"},
            { id: "l-9", title: "Manipulação Avançada de DOM", videoUrl: "assets/Videos/ManipulaçãoDOM.mp4"}
        ]
    }
];

// Estado reativo interno da aplicação
let userState = {
    watchedLessons: [], 
    lessonNotes: {},     
    currentLesson: null  
};

const CREDENCIAIS_VALIDAS = {
    usuario: "admin",
    senha: "1234"
};

// ==========================================================================
// 1. INICIALIZAÇÃO E GERENCIAMENTO DE ESTADO (LOCALSTORAGE)
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    loadStateFromLocalStorage();
    setupEventListeners();
    checkLoginSession();
    setupSidebarNavigation();
});

function loadStateFromLocalStorage() {
    const savedData = localStorage.getItem("eduflow_bootstrap_state");
    if (savedData) {
        userState = JSON.parse(savedData);
    }
}

function saveStateToLocalStorage() {
    localStorage.setItem("eduflow_bootstrap_state", JSON.stringify(userState));
    updateProgressUI();
}

// ==========================================================================
// 2. SISTEMA DE ROTAS/TELAS COM ANIMAÇÃO COERENTE
// ==========================================================================
function navigateTo(screenId) {
    const targetScreen = document.getElementById(screenId);
    
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('d-none');
        screen.classList.remove('d-block', 'd-flex');
    });

    if (screenId === 'login-screen') {
        targetScreen.classList.remove('d-none');
        targetScreen.classList.add('d-flex');
    } else {
        targetScreen.classList.remove('d-none');
        targetScreen.classList.add('d-block');
    }

    if (screenId === 'home-screen') {
        renderModules();
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function checkLoginSession() {
    const isLoggedIn = sessionStorage.getItem("user_logged");
    if (isLoggedIn) {
        navigateTo("home-screen");
    } else {
        navigateTo("login-screen");
    }
}

// ==========================================================================
// 3. CAPTURA E PROCESSAMENTO DE EVENTOS (INCLUINDO ANTERIOR/PRÓXIMA)
// ==========================================================================
function setupEventListeners() {
    
    // Função de autenticação
    function realizarLogin() {
        const usuarioInserido = document.getElementById("username").value.trim();
        const shadowPassword = document.getElementById("password").value;

        if (usuarioInserido === CREDENCIAIS_VALIDAS.usuario && shadowPassword === CREDENCIAIS_VALIDAS.senha) {
            sessionStorage.setItem("user_logged", "true");
            
            const loginCard = document.querySelector('#login-screen main');
            loginCard.style.transition = "transform 0.3s ease, opacity 0.3s ease";
            loginCard.style.transform = "scale(0.95)";
            loginCard.style.opacity = "0";

            setTimeout(() => {
                navigateTo("home-screen");
                loginCard.style.transform = "scale(1)";
                loginCard.style.opacity = "1";
                document.getElementById("username").value = "";
                document.getElementById("password").value = "";
            }, 300);

        } else {
            alert("⚠️ Usuário ou senha incorretos! Digite admin e 1234.");
        }
    }

    // Clique no botão de login
    document.getElementById("btn-entrar-login").addEventListener("click", realizarLogin);

    // Captura a tecla Enter nos campos do formulário
    document.getElementById("username").addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            realizarLogin();
        }
    });
    document.getElementById("password").addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            realizarLogin();
        }
    });

    // Ação do Modal de Logout Confirmado
    document.getElementById("btn-confirm-logout").addEventListener("click", () => {
        sessionStorage.removeItem("user_logged");
        const modalElement = document.getElementById('logoutModal');
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) modalInstance.hide();
        
        navigateTo("login-screen");
    });

    document.getElementById("btn-back-home").addEventListener("click", () => {
        navigateTo("home-screen");
    });


    // Sincronização do Checkbox de Assistida
    document.getElementById("chk-watched").addEventListener("change", (e) => {
        if (!userState.currentLesson) return;
        const lessonId = userState.currentLesson.id;
        if (e.target.checked) {
            if (!userState.watchedLessons.includes(lessonId)) {
                userState.watchedLessons.push(lessonId);
            }
        } else {
            userState.watchedLessons = userState.watchedLessons.filter(id => id !== lessonId);
        }
        saveStateToLocalStorage();
    });

    // LÓGICA DE NAVEGAÇÃO CORRIGIDA: BOTÃO PRÓXIMA AULA (TRAVA NO FIM DO MÓDULO)
    document.getElementById("btn-next-lesson").addEventListener("click", () => {
        if (!userState.currentLesson) return;
        
        let currentModIndex = courseData.findIndex(m => m.lessons.some(l => l.id === userState.currentLesson.id));
        let currentLesIndex = courseData[currentModIndex].lessons.findIndex(l => l.id === userState.currentLesson.id);

        // Avança apenas se houver uma próxima aula dentro do mesmo módulo
        if (currentLesIndex < courseData[currentModIndex].lessons.length - 1) {
            openLesson(courseData[currentModIndex].id, courseData[currentModIndex].lessons[currentLesIndex + 1].id);
        }
    });

    // LÓGICA DE NAVEGAÇÃO CORRIGIDA: BOTÃO AULA ANTERIOR (TRAVA NO INÍCIO DO MÓDULO)
    document.getElementById("btn-prev-lesson").addEventListener("click", () => {
        if (!userState.currentLesson) return;

        let currentModIndex = courseData.findIndex(m => m.lessons.some(l => l.id === userState.currentLesson.id));
        let currentLesIndex = courseData[currentModIndex].lessons.findIndex(l => l.id === userState.currentLesson.id);

        // Recua apenas se houver uma aula anterior dentro do mesmo módulo
        if (currentLesIndex > 0) {
            openLesson(courseData[currentModIndex].id, courseData[currentModIndex].lessons[currentLesIndex - 1].id);
        }
    });

    // Alternância do menu hamburguer (mobile)
    document.getElementById("btn-hamburguer").addEventListener("click", () => {
        const hamburguer = document.getElementById("hamburguer");
        const logOff = document.getElementById("log-off");
        const isHidden = hamburguer.classList.contains("d-none");
        
        if (isHidden) {
            hamburguer.classList.remove("d-none");
            logOff.classList.remove("d-none");
        } else {
            hamburguer.classList.add("d-none");
            logOff.classList.add("d-none");
        }
    });

    // Controle de salvamento automático no Textarea
    const textarea = document.getElementById("lesson-notes");
    const statusNote = document.getElementById("notes-status");
    let typingTimer;

    textarea.addEventListener("input", () => {
        statusNote.innerHTML = "<i class='ri-loader-4-line ri-spin text-primary'></i> Salvando...";
        clearTimeout(typingTimer);
        
        typingTimer = setTimeout(() => {
            if (!userState.currentLesson) return;
            const lessonId = userState.currentLesson.id;
            userState.lessonNotes[lessonId] = textarea.value;
            saveStateToLocalStorage();
            statusNote.innerHTML = "<i class='ri-checkbox-circle-line text-success'></i> Todas as alterações salvas";
        }, 500);
    });
}

// ==========================================================================
// 4. ALTERNÂNCIA DE SUB-VIEWS NA SIDEBAR (CURSOS / DOWNLOADS)
// ==========================================================================
// URL do vídeo institucional (Sobre a Plataforma)
const aboutVideoUrl = "assets/Videos/VideoInstitucional.mp4";

function setupSidebarNavigation() {
    const btnDownload = document.getElementById('nav-download');
    const btnCursos = document.getElementById('nav-courses');
    const viewCursos = document.getElementById('sub-view-courses');
    const viewDownload = document.getElementById('sub-view-download');
    const btnAbout = document.getElementById('about');
    const btnDevelopers = document.getElementById('developers');

    // #nav-download na tela de login: toggle do conteúdo
    if (btnDownload) {
        btnDownload.addEventListener('click', (e) => {
            e.preventDefault();
            const downloadInfo = document.getElementById('download-info');
            downloadInfo.classList.toggle('d-none');
        });
    }

    if (btnCursos) {
        btnCursos.addEventListener('click', (e) => {
            e.preventDefault();
            viewDownload.classList.add('d-none');
            viewCursos.classList.remove('d-none');
            renderModules();
        });
    }

    // #developers - toggle do card de desenvolvedores
    if (btnDevelopers) {
        btnDevelopers.addEventListener('click', (e) => {
            e.preventDefault();
            const devInfo = document.getElementById('developers-info');
            if (devInfo) devInfo.classList.toggle('d-none');
        });
    }

    // #about - toggle do card Sobre a Plataforma com player de vídeo
    if (btnAbout) {
        btnAbout.addEventListener('click', (e) => {
            e.preventDefault();
            const aboutInfo = document.getElementById('about-info');
            if (aboutInfo) {
                aboutInfo.classList.toggle('d-none');

                // Se está mostrando, carrega o vídeo
                if (!aboutInfo.classList.contains('d-none')) {
                    const aboutPlayer = document.getElementById('about-player');
                    if (aboutPlayer) {
                        const video = document.createElement('video');
                        video.className = aboutPlayer.className;
                        video.style.cssText = aboutPlayer.style.cssText;
                        video.style.width = '100%';
                        video.style.objectFit = 'cover';
                        video.src = aboutVideoUrl;
                        video.controls = true;
                        video.autoplay = true;
                        aboutPlayer.replaceWith(video);
                    }
                }
            }
        });
    }
}

// ==========================================================================
// 5. RENDERS DINÂMICOS NO FORMATO DE BARRAS HORIZONTAIS
// ==========================================================================
function renderModules() {
    const container = document.getElementById("modules-container");
    container.innerHTML = "";

    courseData.forEach((module, mIdx) => {
        const totalLessons = module.lessons.length;
        const watchedCount = module.lessons.filter(l => userState.watchedLessons.includes(l.id)).length;
        const progressPercent = totalLessons > 0 ? Math.round((watchedCount / totalLessons) * 100) : 0;

        let colorClass = mIdx % 2 === 0 ? 'bg-primary' : 'bg-warning';

        let lessonsHTML = "";
        module.lessons.forEach(lesson => {
            const isWatched = userState.watchedLessons.includes(lesson.id);
            const iconHTML = isWatched 
                ? `<i class="ri-checkbox-circle-fill text-success fs-5"></i>` 
                : `<i class="ri-checkbox-blank-circle-line text-muted fs-5"></i>`;
            
            lessonsHTML += `
                <button type="button" class="list-group-item list-group-item-action d-flex align-items-center justify-content-between py-2 px-3 border-0 bg-light rounded mb-1" onclick="openLesson('${module.id}', '${lesson.id}')">
                    <div class="d-flex align-items-center gap-2 text-start text-truncate me-2">
                        ${iconHTML}
                        <span class="small fw-medium text-dark text-truncate">${lesson.title}</span>
                    </div>
                    <i class="ri-arrow-right-s-line text-muted flex-shrink-0"></i>
                </button>
            `;
        });

        const moduloRow = document.createElement("div");
        moduloRow.className = "card border-0 shadow-sm p-3 bg-white rounded-3 mb-2";
        moduloRow.innerHTML = `
            <div class="row align-items-center g-3">
                <div class="col-auto d-none d-sm-block">
                    <div class="${colorClass} rounded-pill" style="width: 6px; height: 45px;"></div>
                </div>
                <div class="col ps-sm-3">
                    <span class="text-muted text-uppercase fw-bold" style="font-size: 0.65rem;">Módulo 0${mIdx + 1}</span>
                    <h3 class="h6 fw-bold mb-1 text-dark">${module.title}</h3>
                    <p class="text-muted small mb-0">${watchedCount} de ${totalLessons} aulas concluídas</p>
                </div>
                <div class="col-12 col-md-4 col-lg-3">
                    <div class="d-flex align-items-center gap-3">
                        <div class="progress flex-grow-1" style="height: 6px;">
                            <div class="progress-bar ${colorClass}" style="width: ${progressPercent}%"></div>
                        </div>
                        <span class="small fw-bold text-secondary" style="font-size: 0.8rem;">${progressPercent}%</span>
                    </div>
                </div>
                <div class="col-12 col-md-auto text-end">
                    <button class="btn btn-light btn-sm text-primary fw-semibold w-100 w-md-auto px-3 py-2" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-mod-${mIdx}" aria-expanded="false">
                        Aulas <i class="ri-arrow-down-s-line"></i>
                    </button>
                </div>
            </div>
            <div class="collapse mt-3" id="collapse-mod-${mIdx}">
                <div class="list-group d-flex flex-column gap-1 pt-2 border-top border-light">
                    ${lessonsHTML}
                </div>
            </div>
        `;
        container.appendChild(moduloRow);
    });

    updateProgressUI();
}

function updateProgressUI() {
    let totalLessonsCount = 0;
    courseData.forEach(m => totalLessonsCount += m.lessons.length);
    
    const totalWatched = userState.watchedLessons.length;
    const globalPercent = totalLessonsCount > 0 ? Math.round((totalWatched / totalLessonsCount) * 100) : 0;

    const globalBar = document.getElementById("total-progress-bar");
    const globalText = document.getElementById("total-progress-text");
    
    if (globalBar && globalText) {
        globalBar.style.width = `${globalPercent}%`;
        globalText.innerText = `${globalPercent}% Concluído`;
    }
}

// ==========================================================================
// 6. OPERAÇÕES DE CONFIGURAÇÃO E BLOQUEIO DE BOTÕES (FOCO ATIVO)
// ==========================================================================
function openLesson(moduleId, lessonId) {
    const currentMod = courseData.find(m => m.id === moduleId);
    const currentLes = currentMod.lessons.find(l => l.id === lessonId);
    // 1. Busca a aula correspondente
    let urlVideo = null;

    userState.currentLesson = currentLes;

    document.getElementById("lesson-title").innerText = currentLes.title;
    document.getElementById("lesson-module").innerText = currentMod.title;
    document.getElementById("chk-watched").checked = userState.watchedLessons.includes(lessonId);

    const savedNotes = userState.lessonNotes[lessonId] || "";
    document.getElementById("lesson-notes").value = savedNotes;
    document.getElementById("notes-status").innerHTML = "<i class='ri-checkbox-circle-line text-success'></i> Todas as alterações salvas";

    // ENGENHARIA DE VALIDAÇÃO DOS BOTÕES LIMITADOS AO MÓDULO ATUAL
    const btnPrev = document.getElementById('btn-prev-lesson');
    const btnNext = document.getElementById('btn-next-lesson');

    let currentLesIndex = currentMod.lessons.findIndex(l => l.id === lessonId);

    // Desabilita "Anterior" se for a primeira aula DO MÓDULO ATUAL
    if (currentLesIndex === 0) {
        btnPrev.setAttribute('disabled', 'true');
    } else {
        btnPrev.removeAttribute('disabled');
    }

    // Desabilita "Próxima" se for a última aula DO MÓDULO ATUAL
    const indexUltimaAulaDoModulo = currentMod.lessons.length - 1;
    if (currentLesIndex === indexUltimaAulaDoModulo) {
        btnNext.setAttribute('disabled', 'true');
    } else {
        btnNext.removeAttribute('disabled');
    }

    navigateTo("lesson-screen");

    for (const modulo of courseData) {
        const aula = modulo.lessons.find(l => l.id === lessonId);
        if (aula) {
            urlVideo = aula.videoUrl;
            break; // Para a busca assim que encontrar
        }
    }
        //Seleciona o elemento que vai ser substituído.
        const elementoAtual = document.querySelector('.video-placeholder');
        if (!elementoAtual) return;

    if (!urlVideo) {
        const placeholderDiv = document.createElement('div');
        
        // Aplica as exatas mesmas classes e estilos que configurou
        placeholderDiv.className = "video-placeholder bg-dark rounded-3 d-flex flex-column align-items-center justify-content-center text-white-50 mb-3 shadow-sm";
        placeholderDiv.style.cssText = "min-height: 250px; aspect-ratio: 16/9;";
        
        // Mantém o seu HTML interno (Ícone + Texto)
        placeholderDiv.innerHTML = `
            <i class="ri-play-circle-line display-2" aria-hidden="true"></i>
            <p class="small mt-2">Player de Vídeo Educacional</p>
        `;

        // Substitui o elemento na tela pela sua div padrão
        elementoAtual.replaceWith(placeholderDiv);
        return; 
    }else {

        // Cria o novo vídeo e aplica as configurações (como fizemos antes)
        const videoCurso = document.createElement('video');
        videoCurso.className = elementoAtual.className; 
        videoCurso.style.cssText = elementoAtual.style.cssText;
        videoCurso.style.width = '100%';
        videoCurso.style.objectFit = 'cover';

        // Insere a URL encontrada dinamicamente
        videoCurso.src = urlVideo;
        videoCurso.controls = true;
        videoCurso.autoplay = true; // Como foi um clique do usuário, é interessante dar autoplay

        // Substitui na tela
        elementoAtual.replaceWith(videoCurso);
    }
}