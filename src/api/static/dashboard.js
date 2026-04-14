// Prometheus Dashboard Master Controller (v0.6.0)

document.addEventListener('DOMContentLoaded', () => {
    // Estado Global
    const state = {
        workflows: [],
        currentWorkflow: null,
        analysisResults: null,
        view: 'workflows' // 'workflows', 'projeto', 'tendencias'
    };

    // Função para sanitizar HTML e prevenir XSS
    function sanitizeHtml(str) {
        if (typeof str !== 'string') return str;
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // Criar Banner de Status (Souls Style)
    const banner = document.createElement('div');
    banner.id = 'souls-banner';
    banner.className = 'hidden';
    document.body.appendChild(banner);

    // Criar Toast Container
    const toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    document.body.appendChild(toastContainer);

    // Inicialização
    initNavigation();
    initMusicPlayer();
    loadWorkflows();
    loadProjectStatus();
    loadAnalistas();
    loadLicencas();
    loadPerformance();

    // --- Navegação Global ---
    function initNavigation() {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const view = btn.dataset.view;
                switchView(view);
            });
        });

        // Tabs de Workflow
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                switchTab(tab);
            });
        });

        // Botões de Ferramentas
        document.getElementById('btn-diagnosticar')?.addEventListener('click', async () => {
            const btn = document.getElementById('btn-diagnosticar');
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Executando...';
            btn.disabled = true;
            try {
                const res = await fetch('/api/v1/comando/diagnosticar', { method: 'POST' });
                const data = await res.json();
                alert(data.message || 'Diagnóstico Concluído!');
                loadProjectStatus(); // Atualiza métricas
            } catch (err) {
                alert('Erro na execução: ' + err);
            } finally {
                btn.innerHTML = '<i class="fas fa-stethoscope"></i> Diagnosticar';
                btn.disabled = false;
            }
        });

        document.getElementById('btn-otimizar')?.addEventListener('click', async () => {
            const btn = document.getElementById('btn-otimizar');
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Otimizando...';
            btn.disabled = true;
            try {
                const res = await fetch('/api/v1/comando/otimizar-svg', { method: 'POST' });
                const data = await res.json();
                alert(`Otimização concluída! ${data.otimizados} arquivos processados.`);
            } catch (err) {
                alert('Erro na otimização: ' + err);
            } finally {
                btn.innerHTML = '<i class="fas fa-compress-arrows-alt"></i> Otimizar SVG';
                btn.disabled = false;
            }
        });

        // Botão Executar Análise
        document.getElementById('btn-executar-analise')?.addEventListener('click', async () => {
            const btn = document.getElementById('btn-executar-analise');
            const loading = document.getElementById('analise-loading');
            const results = document.getElementById('analise-results');

            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Executando...';
            loading.classList.remove('hidden');
            results.classList.add('hidden');

            try {
                const res = await fetch('/api/v1/comando/diagnosticar/detalhado', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ full: true, fast: true })
                });
                const data = await res.json();

                if (data.success) {
                    renderAnaliseResults(data);
                    loading.classList.add('hidden');
                    results.classList.remove('hidden');
                    showToast('Análise concluída com sucesso!', 'success');

                    // Auto-scroll para resultados
                    results.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            } catch (err) {
                alert('Erro na análise: ' + err);
                loading.classList.add('hidden');
            } finally {
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-play"></i> Executar Análise';
            }
        });

        // Botão Atualizar Licenças
        document.getElementById('btn-executar-licencas')?.addEventListener('click', async () => {
            const btn = document.getElementById('btn-executar-licencas');
            const loading = document.getElementById('licencas-loading');
            const results = document.getElementById('licencas-results');

            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Escaneando...';
            loading.classList.remove('hidden');
            results.classList.add('hidden');

            try {
                await loadLicencasData();
                loading.classList.add('hidden');
                results.classList.remove('hidden');
                showToast('Scan de licenças concluído!', 'success');
            } catch (err) {
                alert('Erro no scan: ' + err);
                loading.classList.add('hidden');
            } finally {
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-sync"></i> Atualizar';
            }
        });
    }

    function switchView(view) {
        state.view = view;
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelector(`[data-view="${view}"]`).classList.add('active');

        document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
        document.getElementById(`view-${view}`).classList.remove('hidden');

        // Auto-carregar dados quando entrar na view
        if (view === 'tendencias') loadTrends();
        if (view === 'projeto') loadProjectStatus();
        if (view === 'analise') loadAnaliseAuto();
        if (view === 'detectores') loadDetectoresAuto();
        if (view === 'licencas') loadLicencasAuto();
        if (view === 'performance') loadPerformanceAuto();
    }

    // Auto-load functions para tornar análises executáveis
    async function loadAnaliseAuto() {
        const results = document.getElementById('analise-results');
        if (!results.classList.contains('hidden') && state.analiseData) {
            return; // Já tem dados carregados
        }

        // Executar análise automaticamente ao entrar na view
        const btn = document.getElementById('btn-executar-analise');
        if (btn && !btn.disabled) {
            btn.click();
        }
    }

    async function loadDetectoresAuto() {
        const listEl = document.getElementById('analista-list');
        if (listEl && !listEl.querySelector('.loading-state') && listEl.children.length > 0) {
            return; // Já tem dados carregados
        }
        await loadAnalistas();
    }

    async function loadLicencasAuto() {
        const results = document.getElementById('licencas-results');
        if (!results.classList.contains('hidden')) {
            return; // Já tem dados carregados
        }
        await loadLicencasData();
        results.classList.remove('hidden');
    }

    async function loadPerformanceAuto() {
        await loadPerformance();
    }

    function switchTab(tab) {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

        document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
        document.getElementById(`tab-${tab}`).classList.remove('hidden');

        if (tab === 'grafo' && state.analysisResults) renderGraph();
    }

    // --- API Interactions ---
    async function loadWorkflows() {
        const list = document.getElementById('workflow-list');
        list.innerHTML = '<li class="loading"><i class="fas fa-spinner fa-spin"></i> Carregando workflows...</li>';

        try {
            const res = await fetch('/api/v1/repositorio/arquivos');
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();
            state.workflows = data.workflows || [];

            if (state.workflows.length === 0) {
                list.innerHTML = '<li class="empty"><i class="fas fa-info-circle"></i> Nenhum workflow encontrado</li>';
            } else {
                renderWorkflowList();
            }
        } catch (err) {
            console.error('Erro ao listar workflows:', err);
            list.innerHTML = '<li class="error"><i class="fas fa-exclamation-triangle"></i> Erro ao carregar</li>';
            showToast('Erro ao carregar workflows', 'error');
        }
    }

    async function loadProjectStatus() {
        const integrityEl = document.getElementById('status-integridade');
        integrityEl.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

        try {
            const res = await fetch('/api/v1/repositorio/status');
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();

            document.getElementById('status-integridade').textContent = data.saude || 'OK';
            document.getElementById('info-workflows').textContent = data.metricas?.workflows || '0';
            document.getElementById('info-versao').textContent = data.versao || '0.6.0';

            // Adicionar mais métricas se disponíveis
            if (data.metricas?.totalFiles) {
                const filesEl = document.getElementById('info-files');
                if (filesEl) filesEl.textContent = data.metricas.totalFiles;
            }

            if (data.metricas?.dependencies !== undefined) {
                const depsEl = document.getElementById('info-dependencies');
                if (depsEl) depsEl.textContent = data.metricas.dependencies;
            }

            const guardianDesc = document.getElementById('guardian-desc');
            if (data.metricas?.integridade) {
                guardianDesc.textContent = data.metricas.integridade;
            }

            if (data.metricas?.radar) {
                renderRadarChart(data.metricas.radar);
            }

            // Atualizar barra de progresso do guardian
            const healthBar = document.querySelector('.health-bar .fill');
            if (healthBar && data.metricas?.radar) {
                const avgScore = Object.values(data.metricas.radar).reduce((a, b) => a + b, 0) / 5;
                healthBar.style.width = `${avgScore}%`;

                // Cor baseada no score
                if (avgScore >= 80) {
                    healthBar.style.background = 'var(--success)';
                } else if (avgScore >= 60) {
                    healthBar.style.background = 'var(--warning)';
                } else {
                    healthBar.style.background = 'var(--critical)';
                }
            }
        } catch (err) {
            console.error('Erro ao obter status:', err);
            integrityEl.textContent = 'Erro';
            integrityEl.style.color = 'var(--critical)';
            showToast('Erro ao carregar status do projeto', 'error');
        }
    }

    function renderRadarChart(radarData) {
        const ctx = document.getElementById('radar-chart').getContext('2d');
        if (window.radarChart) window.radarChart.destroy();

        window.radarChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Segurança', 'Performance', 'Documentação', 'Arquitetura', 'Qualidade'],
                datasets: [{
                    label: 'Saúde do Projeto',
                    data: [
                        radarData.seguranca || 0,
                        radarData.performance || 0,
                        radarData.documentacao || 0,
                        radarData.arquitetura || 0,
                        radarData.qualidade || 0
                    ],
                    backgroundColor: 'rgba(78, 205, 196, 0.2)',
                    borderColor: '#4ecdc4',
                    pointBackgroundColor: '#4ecdc4',
                    borderWidth: 2
                }]
            },
            options: {
                scales: {
                    r: {
                        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        pointLabels: { color: '#a4b0be', font: { size: 12 } },
                        ticks: { display: false, max: 100, min: 0, stepSize: 20 }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }

    function renderWorkflowList() {
        const list = document.getElementById('workflow-list');
        list.textContent = '';
        state.workflows.forEach(wf => {
            const li = document.createElement('li');
            li.textContent = wf;
            li.addEventListener('click', () => analyzeWorkflow(wf));
            list.appendChild(li);
        });
    }

    async function analyzeWorkflow(relPath) {
        state.currentWorkflow = relPath;
        document.getElementById('welcome-screen').classList.add('hidden');
        document.getElementById('analysis-detail').classList.remove('hidden');
        document.getElementById('current-workflow-name').textContent = relPath;

        // Mostrar loading
        const scoreEl = document.getElementById('workflow-score');
        scoreEl.textContent = '<i class="fas fa-spinner fa-spin"></i> Analisando...';
        scoreEl.className = 'score-badge loading';

        // Limpar resultados anteriores
        const list = document.querySelectorAll('#workflow-list li');
        list.forEach(li => li.classList.remove('active'));
        document.querySelector(`#workflow-list li:nth-child(${state.workflows.indexOf(relPath) + 1})`)?.classList.add('active');

        try {
            const res = await fetch('/api/v1/analistas/github-actions/analisar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ relPath })
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();
            state.analysisResults = data.resultados || [];
            renderAnalysis();
            showToast('Análise concluída com sucesso!', 'success');
        } catch (err) {
            console.error('Erro na análise:', err);
            scoreEl.textContent = 'Erro na análise';
            scoreEl.className = 'score-badge error';
            showToast('Erro ao analisar workflow', 'error');
        }
    }

    function renderAnalysis() {
        const results = state.analysisResults || [];
        const score = 100 - (results.length * 5);
        const scoreEl = document.getElementById('workflow-score');
        scoreEl.textContent = `Score: ${Math.max(0, score)}`;
        scoreEl.className = 'score-badge ' + (score > 80 ? 'good' : (score > 50 ? 'warn' : 'critical'));

        // Problemas Tabela
        const body = document.getElementById('problems-body');
        body.textContent = '';
        results.forEach(p => {
            const tr = document.createElement('tr');

            const tdLinha = document.createElement('td');
            tdLinha.textContent = p.linha || 1;

            const tdTipo = document.createElement('td');
            tdTipo.textContent = p.tipo;

            const tdMsg = document.createElement('td');
            tdMsg.textContent = p.mensagem;

            const tdNivel = document.createElement('td');
            const spanNivel = document.createElement('span');
            spanNivel.className = `severity ${p.nivel}`;
            spanNivel.textContent = p.nivel;
            tdNivel.appendChild(spanNivel);

            tr.appendChild(tdLinha);
            tr.appendChild(tdTipo);
            tr.appendChild(tdMsg);
            tr.appendChild(tdNivel);

            body.appendChild(tr);
        });

        // Resumo
        const hasCritical = results.some(r => r.nivel === 'erro');
        const hasWarnings = results.some(r => r.nivel === 'aviso');

        // Sec status - DOM seguro
        const secStatus = document.getElementById('sec-status');
        secStatus.innerHTML = '';
        const secIcon = document.createElement('i');
        secIcon.className = hasCritical ? 'fas fa-times-circle' : 'fas fa-check-circle';
        secStatus.appendChild(secIcon);
        secStatus.appendChild(document.createTextNode(hasCritical ? ' Problemas de Segurança' : ' Seguro'));
        secStatus.className = hasCritical ? 'critical' : 'success';

        // Performance status - DOM seguro
        const perfIssues = results.filter(r => r.tipo?.toLowerCase().includes('performance'));
        const perfStatus = document.getElementById('perf-status');
        perfStatus.innerHTML = '';
        const perfIcon = document.createElement('i');
        perfIcon.className = perfIssues.length > 0 ? 'fas fa-exclamation-triangle' : 'fas fa-check-circle';
        perfStatus.appendChild(perfIcon);
        perfStatus.appendChild(document.createTextNode(perfIssues.length > 0 ? ` ${perfIssues.length} problema(s)` : ' Otimizada'));
        perfStatus.style.color = perfIssues.length > 0 ? 'var(--warning)' : '#10b981';

        // Boas práticas - DOM seguro
        const bestPractices = results.filter(r => r.tipo?.toLowerCase().includes('best practice') || r.tipo?.toLowerCase().includes('boa prática'));
        const bpStatus = document.getElementById('best-practices-status');
        bpStatus.innerHTML = '';
        const bpIcon = document.createElement('i');
        bpIcon.className = bestPractices.length === 0 ? 'fas fa-check-circle' : 'fas fa-exclamation-triangle';
        bpStatus.appendChild(bpIcon);
        bpStatus.appendChild(document.createTextNode(bestPractices.length === 0 ? ' Aplicadas' : ` ${bestPractices.length} pendente(s)`));
        bpStatus.style.color = bestPractices.length === 0 ? '#10b981' : 'var(--warning)';

        // Documentação - DOM seguro
        const docIssues = results.filter(r => r.tipo?.toLowerCase().includes('document'));
        const docStatus = document.getElementById('docs-status');
        docStatus.innerHTML = '';
        const docIcon = document.createElement('i');
        docIcon.className = docIssues.length > 0 ? 'fas fa-book-open' : 'fas fa-check-circle';
        docStatus.appendChild(docIcon);
        docStatus.appendChild(document.createTextNode(docIssues.length > 0 ? ` ${docIssues.length} melhoria(s)` : ' Completa'));
        docStatus.style.color = docIssues.length > 0 ? 'var(--warning)' : '#10b981';

        // Souls Feedback
        showSoulsBanner(hasCritical, score);

        // Reset view to resume
        switchTab('resumo');
    }

    function showSoulsBanner(hasCritical, score) {
        const b = document.getElementById('souls-banner');
        if (!b) return;

        b.className = '';
        if (score >= 100) {
            b.textContent = 'VICTORY ACHIEVED';
            b.classList.add('victory', 'visible');
        } else if (hasCritical) {
            b.textContent = 'YOU DIED';
            b.classList.add('death', 'visible');
        }

        setTimeout(() => {
            b.classList.remove('visible');
            b.classList.add('hidden');
        }, 4000);
    }

    function renderGraph() {
        const mermaidDiv = document.getElementById('workflow-graph');

        if (!state.analysisResults || state.analysisResults.length === 0) {
            mermaidDiv.innerHTML = '<div class="empty-state"><i class="fas fa-project-diagram"></i><p>Nenhum dado para exibir</p></div>';
            return;
        }

        // Construir grafo baseado nos jobs/steps do workflow
        let graphDef = 'graph TD;\n';
        graphDef += '    classDef default fill:#0a0a0a,stroke:#c29a53,stroke-width:2px,color:#e2e8f0;\n';
        graphDef += '    classDef success fill:#065f46,stroke:#10b981,stroke-width:2px;\n';
        graphDef += '    classDef warning fill:#b45309,stroke:#f59e0b,stroke-width:2px;\n';
        graphDef += '    classDef error fill:#991b1b,stroke:#ef4444,stroke-width:2px;\n\n';

        // Parse dos resultados para extrair jobs
        const jobs = [];
        const jobMap = {};

        state.analysisResults.forEach((result, idx) => {
            if (result.mensagem && result.mensagem.includes('Job')) {
                const jobName = result.mensagem.replace('Job ', '').trim();
                const jobId = `job${idx}`;
                jobMap[jobName] = jobId;
                jobs.push({ id: jobId, name: jobName, nivel: result.nivel });
            }
        });

        if (jobs.length === 0) {
            // Se não tem jobs, criar grafo simples
            graphDef += '    Start([Início]) --> Analise[Análise Concluída];\n';
            graphDef += '    class Start success;\n';
            graphDef += '    class Analise success;\n';
        } else {
            // Criar grafo com jobs
            graphDef += '    Start([Workflow Start]) --> ' + jobs[0].id + ';\n';
            graphDef += '    class Start success;\n';

            jobs.forEach((job, idx) => {
                const safeId = job.id.replace(/[^a-zA-Z0-9]/g, '_');
                const label = job.name.replace(/[^a-zA-Z0-9\\s]/g, '');

                graphDef += `    ${safeId}["${label}"];\n`;

                // Adicionar classe baseada no nível
                if (job.nivel === 'erro') {
                    graphDef += `    class ${safeId} error;\n`;
                } else if (job.nivel === 'aviso') {
                    graphDef += `    class ${safeId} warning;\n`;
                }

                // Conectar ao próximo job
                if (idx < jobs.length - 1) {
                    const nextJob = jobs[idx + 1].id.replace(/[^a-zA-Z0-9]/g, '_');
                    graphDef += `    ${safeId} --> ${nextJob};\n`;
                } else {
                    graphDef += `    ${safeId} --> End([Concluído]);\n`;
                    graphDef += '    class End success;\n';
                }
            });
        }

        mermaidDiv.textContent = graphDef;
        mermaid.init(undefined, mermaidDiv);
    }

    // Função para mostrar toast notifications
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        const icon = type === 'success' ? 'check-circle' :
            type === 'error' ? 'exclamation-circle' : 'info-circle';

        const iconEl = document.createElement('i');
        iconEl.className = `fas fa-${icon}`;
        const msgSpan = document.createElement('span');
        msgSpan.textContent = message;
        const closeBtn = document.createElement('button');
        closeBtn.className = 'toast-close';
        closeBtn.setAttribute('aria-label', 'Fechar notificação');
        closeBtn.textContent = '\u00D7';
        closeBtn.addEventListener('click', () => toast.remove());

        toast.appendChild(iconEl);
        toast.appendChild(msgSpan);
        toast.appendChild(closeBtn);

        toastContainer.appendChild(toast);

        // Auto-remove após 5 segundos
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }

    // --- Music Player ---
    function initMusicPlayer() {
        const audioPlayer = document.getElementById('audio-player');
        const musicToggle = document.getElementById('music-toggle');
        const musicControls = document.getElementById('music-controls');
        const playBtn = document.getElementById('music-play');
        const pauseBtn = document.getElementById('music-pause');
        const volumeSlider = document.getElementById('music-volume');

        let isPlaying = false;
        let isExpanded = false;

        // Set initial volume
        if (audioPlayer) {
            audioPlayer.volume = 0.3;
        }

        // Toggle expand/collapse
        musicToggle?.addEventListener('click', () => {
            isExpanded = !isExpanded;
            musicControls.classList.toggle('visible', isExpanded);

            // Auto-play on first expand
            if (isExpanded && !isPlaying) {
                playMusic();
            }
        });

        // Play button
        playBtn?.addEventListener('click', () => {
            playMusic();
        });

        // Pause button
        pauseBtn?.addEventListener('click', () => {
            pauseMusic();
        });

        // Volume control
        volumeSlider?.addEventListener('input', (e) => {
            if (audioPlayer) {
                audioPlayer.volume = parseFloat(e.target.value);
            }
        });

        function playMusic() {
            if (audioPlayer) {
                audioPlayer.play().catch(err => {
                    console.log('Autoplay blocked, waiting user interaction');
                });
                isPlaying = true;
                playBtn.style.display = 'none';
                pauseBtn.style.display = 'flex';
                musicToggle.classList.add('playing');
            }
        }

        function pauseMusic() {
            if (audioPlayer) {
                audioPlayer.pause();
                isPlaying = false;
                playBtn.style.display = 'flex';
                pauseBtn.style.display = 'none';
                musicToggle.classList.remove('playing');
            }
        }
    }

    async function loadTrends() {
        const chartContainer = document.querySelector('#view-tendencias .chart-container');
        chartContainer.innerHTML = '<div class="loading-state"><i class="fas fa-spinner fa-spin"></i><p>Carregando histórico...</p></div>';

        try {
            const res = await fetch('/api/v1/repositorio/metricas');
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();

            if (!data || data.length === 0) {
                chartContainer.innerHTML = '<div class="empty-state"><i class="fas fa-chart-line"></i><p>Sem dados históricos</p></div>';
                return;
            }

            renderChart(data);
        } catch (err) {
            console.error('Erro ao carregar tendências:', err);
            chartContainer.innerHTML = '<div class="error-state"><i class="fas fa-exclamation-triangle"></i><p>Erro ao carregar dados</p></div>';
            showToast('Erro ao carregar tendências', 'error');
        }
    }

    // Função para carregar lista de analistas
    async function loadAnalistas() {
        const listEl = document.getElementById('analista-list');

        try {
            const res = await fetch('/api/v1/analistas/lista');
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();

            // Atualizar contadores
            document.getElementById('total-detectores').textContent = data.categorias?.detectores || 0;
            document.getElementById('total-plugins').textContent = data.categorias?.plugins || 0;
            document.getElementById('total-tecnicas').textContent = data.categorias?.tecnicas || 0;

            // Renderizar lista
            renderAnalistaList(data.analistas || []);
        } catch (err) {
            console.error('Erro ao carregar analistas:', err);
            listEl.innerHTML = '<div class="error-state"><i class="fas fa-exclamation-triangle"></i><p>Erro ao carregar analistas</p></div>';
        }
    }

    function renderAnalistaList(analistas) {
        const listEl = document.getElementById('analista-list');
        listEl.innerHTML = '';

        // Agrupar por categoria
        const porCategoria = {};
        analistas.forEach(a => {
            const cat = a.categoria || 'Geral';
            if (!porCategoria[cat]) {
                porCategoria[cat] = [];
            }
            porCategoria[cat].push(a);
        });

        Object.entries(porCategoria).forEach(([categoria, items]) => {
            const section = document.createElement('div');
            section.className = 'analista-category';

            const title = document.createElement('h4');
            title.className = 'category-title';
            const icon = document.createElement('i');
            icon.className = 'fas fa-folder';
            title.appendChild(icon);
            title.appendChild(document.createTextNode(` ${categoria} (${items.length})`));
            section.appendChild(title);

            const grid = document.createElement('div');
            grid.className = 'analista-grid';

            items.forEach(analista => {
                const card = document.createElement('div');
                card.className = 'analista-card';
                const nameDiv = document.createElement('div');
                nameDiv.className = 'analista-name';
                nameDiv.textContent = analista.nome || '';
                const descDiv = document.createElement('div');
                descDiv.className = 'analista-desc';
                descDiv.textContent = analista.descricao || 'Sem descrição';
                card.appendChild(nameDiv);
                card.appendChild(descDiv);
                grid.appendChild(card);
            });

            section.appendChild(grid);
            listEl.appendChild(section);
        });
    }

    // Função para carregar dados de análise
    async function loadAnalise() {
        // Auto-load se já tiver resultados
        if (state.analiseData) {
            renderAnaliseResults(state.analiseData);
            document.getElementById('analise-results').classList.remove('hidden');
        }
    }

    function renderAnaliseResults(data) {
        state.analiseData = data;

        // Atualizar números
        document.getElementById('analise-erros').textContent = data.ocorrenciasPorNivel?.erro || 0;
        document.getElementById('analise-avisos').textContent = data.ocorrenciasPorNivel?.aviso || 0;
        document.getElementById('analise-info').textContent = data.ocorrenciasPorNivel?.info || 0;
        document.getElementById('analise-arquivos').textContent = data.metricas?.totalArquivos || 0;
        document.getElementById('analise-tempo').textContent = `${Math.round(data.metricas?.tempoAnalise || 0)}ms`;

        // Preencher tabela de problemas
        const tbody = document.getElementById('analise-problemas-body');
        tbody.innerHTML = '';

        const ocorrencias = data.ocorrencias || [];
        ocorrencias.slice(0, 50).forEach(oc => {
            const tr = document.createElement('tr');
            const tdTipo = document.createElement('td');
            tdTipo.textContent = oc.tipo || 'N/A';
            const tdMsg = document.createElement('td');
            tdMsg.textContent = oc.mensagem || '';
            const tdArquivo = document.createElement('td');
            tdArquivo.textContent = oc.relPath || '';
            const tdLinha = document.createElement('td');
            tdLinha.textContent = oc.linha || '-';
            const tdNivel = document.createElement('td');
            const spanNivel = document.createElement('span');
            spanNivel.className = `severity ${oc.nivel || 'info'}`;
            spanNivel.textContent = oc.nivel || 'info';
            tdNivel.appendChild(spanNivel);
            tr.appendChild(tdTipo);
            tr.appendChild(tdMsg);
            tr.appendChild(tdArquivo);
            tr.appendChild(tdLinha);
            tr.appendChild(tdNivel);
            tbody.appendChild(tr);
        });
    }

    // Função para carregar dados de licenças
    async function loadLicencas() {
        await loadLicencasData();
    }

    async function loadLicencasData() {
        try {
            const res = await fetch('/api/v1/licensas/scan');
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();
            renderLicencas(data);
        } catch (err) {
            console.error('Erro ao carregar licenças:', err);
            document.getElementById('licencas-results').innerHTML =
                '<div class="error-state"><i class="fas fa-exclamation-triangle"></i><p>Erro ao carregar licenças</p></div>';
        }
    }

    function renderLicencas(data) {
        // Atualizar números
        document.getElementById('licencas-total').textContent = data.totalPackages || 0;
        document.getElementById('licencas-validas').textContent = (data.totalFiltered || 0) - (data.problematicas?.length || 0);
        document.getElementById('licencas-problematicas').textContent = data.problematicas?.length || 0;

        // Renderizar gráfico de distribuição
        renderLicencasChart(data.distribuicao);

        // Top licenças
        const topList = document.getElementById('licencas-top-list');
        topList.innerHTML = '';
        (data.licencas || []).slice(0, 8).forEach(([licenca, count]) => {
            const li = document.createElement('li');
            li.className = 'license-item';
            const spanName = document.createElement('span');
            spanName.className = 'license-name';
            spanName.textContent = licenca || '';
            const spanCount = document.createElement('span');
            spanCount.className = 'license-count';
            spanCount.textContent = String(count);
            li.appendChild(spanName);
            li.appendChild(spanCount);
            topList.appendChild(li);
        });

        // Tabela de problemáticas
        const tbody = document.getElementById('licencas-problematicas-body');
        tbody.innerHTML = '';
        (data.problematicas || []).forEach(pkg => {
            const tr = document.createElement('tr');
            const tdNome = document.createElement('td');
            tdNome.textContent = pkg.name || '';
            const tdVersao = document.createElement('td');
            tdVersao.textContent = pkg.version || '';
            const tdLicenca = document.createElement('td');
            const spanLicenca = document.createElement('span');
            spanLicenca.className = 'severity erro';
            spanLicenca.textContent = 'UNKNOWN';
            tdLicenca.appendChild(spanLicenca);
            const tdRepo = document.createElement('td');
            tdRepo.textContent = pkg.repository || '-';
            tr.appendChild(tdNome);
            tr.appendChild(tdVersao);
            tr.appendChild(tdLicenca);
            tr.appendChild(tdRepo);
            tbody.appendChild(tr);
        });

        if (data.problematicas?.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="empty-state"><i class="fas fa-check-circle"></i> Nenhuma licença problemática encontrada</td></tr>';
        }
    }

    function renderLicencasChart(distribuicao) {
        const ctx = document.getElementById('licencas-chart').getContext('2d');
        if (window.licencasChart) window.licencasChart.destroy();

        window.licencasChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Permissivas', 'Copyleft', 'Desconhecidas'],
                datasets: [{
                    data: [
                        distribuicao?.permissivas || 0,
                        distribuicao?.copyleft || 0,
                        distribuicao?.desconhecidas || 0
                    ],
                    backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#a4b0be', padding: 15 }
                    }
                }
            }
        });
    }

    // Função para carregar métricas de performance
    async function loadPerformance() {
        try {
            const res = await fetch('/api/v1/perf/metricas');
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();
            renderPerformance(data);
        } catch (err) {
            console.error('Erro ao carregar performance:', err);
        }
    }

    function renderPerformance(data) {
        // Métricas atuais
        const atual = data.atual || {};
        document.getElementById('perf-tempo').textContent = `${Math.round(atual.tempoExecucao || 0)}ms`;
        document.getElementById('perf-memoria').textContent = `${Math.round(atual.memoriaUsada || 0)}MB`;
        document.getElementById('perf-arquivos').textContent = atual.arquivosProcessados || 0;

        // Gráfico de histórico
        renderPerformanceChart(data.baselines || []);

        // Gráfico de analistas
        renderAnalistasChart(data.metricas?.analistas || []);
    }

    function renderPerformanceChart(baselines) {
        const ctx = document.getElementById('perf-chart').getContext('2d');
        if (window.perfChart) window.perfChart.destroy();

        window.perfChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: baselines.map((_, i) => `T-${baselines.length - 1 - i}`),
                datasets: [
                    {
                        label: 'Tempo (ms)',
                        data: baselines.map(b => b.tempoExecucao),
                        borderColor: '#4ecdc4',
                        backgroundColor: 'rgba(78, 205, 196, 0.1)',
                        tension: 0.4,
                        fill: true,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Memória (MB)',
                        data: baselines.map(b => b.memoriaUsada),
                        borderColor: '#ff4757',
                        backgroundColor: 'rgba(255, 71, 87, 0.1)',
                        tension: 0.4,
                        fill: true,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        ticks: { color: '#4ecdc4' }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        grid: { drawOnChartArea: false },
                        ticks: { color: '#ff4757' }
                    },
                    x: {
                        grid: { display: false }
                    }
                },
                plugins: {
                    legend: {
                        labels: { color: '#a4b0be' }
                    }
                }
            }
        });
    }

    function renderAnalistasChart(analistas) {
        const ctx = document.getElementById('analistas-chart').getContext('2d');
        if (window.analistasChart) window.analistasChart.destroy();

        const topAnalistas = analistas
            .filter(a => a.duracaoMs > 0)
            .sort((a, b) => b.duracaoMs - a.duracaoMs)
            .slice(0, 10);

        window.analistasChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: topAnalistas.map(a => a.nome),
                datasets: [{
                    label: 'Tempo (ms)',
                    data: topAnalistas.map(a => a.duracaoMs),
                    backgroundColor: 'rgba(78, 205, 196, 0.6)',
                    borderColor: '#4ecdc4',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                scales: {
                    x: {
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        ticks: { color: '#a4b0be' }
                    },
                    y: {
                        grid: { display: false },
                        ticks: { color: '#a4b0be' }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }

    function renderChart(data) {
        const ctx = document.getElementById('trend-chart').getContext('2d');
        if (window.myChart) window.myChart.destroy();

        window.myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(d => new Date(d.timestamp).toLocaleDateString()),
                datasets: [{
                    label: 'Score de Saúde',
                    data: data.map(d => d.score),
                    borderColor: '#ff4757',
                    tension: 0.4,
                    fill: true,
                    backgroundColor: 'rgba(255, 71, 87, 0.1)'
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: false, grid: { color: 'rgba(255,255,255,0.05)' } },
                    x: { grid: { display: false } }
                }
            }
        });
    }
});
