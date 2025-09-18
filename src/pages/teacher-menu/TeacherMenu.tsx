

export default function TeacherMenu() {
    return (
    <div className="educador-container">
        <aside className="aluno-sidebar">
        <h3>Alunos</h3>
        <ul>
            <li>Maria Clara</li>
            <li>João Pedro</li>
            <li>Lucas Silva</li>
        </ul>

        <button className="botao-adicionar-aluno">+ Adicionar Aluno</button>
        </aside>


        <main className="painel-aluno">
        <div className="topo-painel">
            <h2>Detalhes do Aluno</h2>
        </div>

        <section className="info-aluno">
            <img 
                src="../../assets/images/perfil-default.webp"
                alt="logoDoSite"
                loading="lazy"
                decoding="async"
                className="foto-aluno"
            />
            <div className="dados-aluno">
            <p><strong>Nome:</strong> Maria Clara</p>
            <p><strong>Email:</strong> maria@ifsp.edu.br</p>
            <p><strong>ID:</strong> 001-A</p>
            <p><strong>Fase Atual:</strong> Vogais - E</p>
            <p><strong>Nível de Autismo:</strong> Moderado</p>
            <p><strong>Especificações:</strong> Melhor concentração em sessões curtas.</p>
            </div>
            <div className="anotacoes">
            Anotações:
            {/* <textarea id="anotacoes" rows="4" placeholder="Digite suas observações aqui..."></textarea> */}
            </div>
        </section>

        <section className="graficos-aluno">
            <div className="grafico">📊 Qtd de Erros por Fase</div>
            <div className="grafico">🔁 Qtd de Reproduções por Fase</div>
            <div className="grafico">⏱️ Tempo Médio por Sessão</div>
            <div className="grafico">📅 Média de Fases por Mês</div>
        </section>
        </main>
    </div>
    );
}