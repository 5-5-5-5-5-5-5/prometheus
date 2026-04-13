// Prometheus Dashboard Master Controller (v0.6.0)

document.addEventListener('DOMContentLoaded', () => {
    // Estado Global
    const state = {
        workflows: [],
        currentWorkflow: null,
        analysisResults: null,
        view: 'workflows' // 'workflows', 'projeto', 'tendencias'
    };

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
    }

    function switchView(view) {
        state.view = view;
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelector(`[data-view="${view}"]`).classList.add('active');

        document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
        document.getElementById(`view-${view}`).classList.remove('hidden');

        if (view === 'tendencias') loadTrends();
        if (view === 'projeto') loadProjectStatus();
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

        document.getElementById('sec-status').textContent = hasCritical ? '❌ Problemas de Segurança' : '✅ Seguro';
        document.getElementById('sec-status').className = hasCritical ? 'critical' : 'success';

        // Performance status
        const perfIssues = results.filter(r => r.tipo?.toLowerCase().includes('performance'));
        document.getElementById('perf-status').textContent = perfIssues.length > 0 ? `⚠️ ${perfIssues.length} problema(s)` : '✅ Otimizada';
        document.getElementById('perf-status').style.color = perfIssues.length > 0 ? 'var(--warning)' : '#10b981';

        // Boas práticas
        const bestPractices = results.filter(r => r.tipo?.toLowerCase().includes('best practice') || r.tipo?.toLowerCase().includes('boa prática'));
        document.getElementById('best-practices-status').textContent = bestPractices.length === 0 ? '✅ Aplicadas' : `⚠️ ${bestPractices.length} pendente(s)`;
        document.getElementById('best-practices-status').style.color = bestPractices.length === 0 ? '#10b981' : 'var(--warning)';

        // Documentação
        const docIssues = results.filter(r => r.tipo?.toLowerCase().includes('document'));
        document.getElementById('docs-status').textContent = docIssues.length > 0 ? `📝 ${docIssues.length} melhoria(s)` : '✅ Completa';
        document.getElementById('docs-status').style.color = docIssues.length > 0 ? 'var(--warning)' : '#10b981';

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

        toast.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
            <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
        `;

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
