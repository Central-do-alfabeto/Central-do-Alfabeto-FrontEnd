import styles from "../../assets/styles/css/teacher-menu.module.css";
import profilePlaceholder from "../../assets/images/perfil-default.webp";

const dummyStudents = [
    "Maria Clara",
    "João Pedro",
    "Lucas Silva"
];

export default function TeacherMenu() {
    return (
        <div className={styles.page}>
            <div className={styles.layout}>
                <aside className={styles.sidebar}>
                    <h3 className={styles.sidebarTitle}>Alunos</h3>
                    <ul className={styles.studentList}>
                        {dummyStudents.map((student) => (
                            <li key={student} className={styles.studentItem} tabIndex={0}>
                                {student}
                            </li>
                        ))}
                    </ul>

                    <button type="button" className={styles.addStudentButton}>
                        + Adicionar aluno
                    </button>
                </aside>

                <main className={styles.mainPanel}>
                    <div className={styles.panelHeader}>
                        <h2>Detalhes do aluno</h2>
                    </div>

                    <section className={styles.studentInfo} aria-labelledby="student-details-heading">
                        <h3 id="student-details-heading" className={styles.srOnly}>
                            Informações principais do aluno selecionado
                        </h3>
                        <img
                            src={profilePlaceholder}
                            alt="Foto do aluno selecionado"
                            loading="lazy"
                            decoding="async"
                            className={styles.studentPhoto}
                        />

                        <div className={styles.studentDetails}>
                            <p><strong>Nome:</strong> Maria Clara</p>
                            <p><strong>Email:</strong> maria@ifsp.edu.br</p>
                            <p><strong>ID:</strong> 001-A</p>
                            <p><strong>Fase atual:</strong> Vogais - E</p>
                            <p><strong>Nível de autismo:</strong> Moderado</p>
                            <p><strong>Observações:</strong> Melhor concentração em sessões curtas.</p>
                        </div>

                        <div className={styles.notes}>
                            Anotações: (em breve)
                        </div>
                    </section>

                    <section className={styles.metricsGrid} aria-label="Indicadores de progresso do aluno">
                        <div className={styles.metricCard}>📊 Qtd de erros por fase</div>
                        <div className={styles.metricCard}>🔁 Reproduções por fase</div>
                        <div className={styles.metricCard}>⏱️ Tempo médio por sessão</div>
                        <div className={styles.metricCard}>📅 Média de fases por mês</div>
                    </section>
                </main>
            </div>
        </div>
    );
}