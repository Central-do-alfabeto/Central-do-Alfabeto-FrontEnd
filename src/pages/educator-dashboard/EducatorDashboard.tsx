import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../../assets/styles/css/educator-dashboard.module.css";
import logo from "../../assets/images/logo-do-site.png";
import type { TeacherStudentSummary } from "../../services/api/loginAPI";
import { addEducatorStudent, fetchEducatorStudents } from "../../services/api/educatorStudents";
import { clearAuthSession, getAuthUserId } from "../../store/auth";
import { getStudents as getStoredStudents, setStudents as setStoredStudents } from "../../store/TeacherStudentsInfo";

const sortStudents = (students: TeacherStudentSummary[]): TeacherStudentSummary[] =>
  [...students].sort((a, b) => a.fullName.localeCompare(b.fullName, "pt-BR", { sensitivity: "base" }));

export default function EducatorDashboard() {
  const navigate = useNavigate();
  const educatorId = getAuthUserId();
  const [students, setStudents] = useState<TeacherStudentSummary[]>(() => sortStudents(getStoredStudents()));
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentEmail, setStudentEmail] = useState("");
  const [studentName, setStudentName] = useState("");
  const [modalError, setModalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogout = useCallback(() => {
    clearAuthSession();
    setStoredStudents([]);
    navigate("/Login", { replace: true });
  }, [navigate]);

  useEffect(() => {
    if (!educatorId) {
      navigate("/Login", { replace: true });
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    fetchEducatorStudents(educatorId)
      .then((fetched) => {
        if (cancelled) {
          return;
        }

        const sorted = sortStudents(fetched);
        setStudents(sorted);
        setStoredStudents(sorted);
        setFetchError(null);
      })
      .catch((error) => {
        if (cancelled) {
          return;
        }

        if (axios.isAxiosError(error) && error.response && [401, 403].includes(error.response.status)) {
          handleLogout();
          return;
        }

        setFetchError("Não foi possível carregar os alunos. Tente novamente mais tarde.");
        console.error("Falha ao carregar alunos do educador:", error);
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [educatorId, handleLogout, navigate]);

  const openModal = () => {
    setModalError(null);
    setStudentEmail("");
    setStudentName("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSubmitting) {
      return;
    }
    setIsModalOpen(false);
    setModalError(null);
  };

  const handleAddStudent = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!educatorId) {
      setModalError("Sessão expirada. Faça login novamente.");
      return;
    }

    const trimmedEmail = studentEmail.trim();
    const trimmedName = studentName.trim();

    if (!trimmedEmail || !trimmedName) {
      setModalError("Informe email e nome do aluno.");
      return;
    }

    setIsSubmitting(true);
    setModalError(null);

    try {
      const created = await addEducatorStudent(educatorId, {
        email: trimmedEmail,
        studentName: trimmedName,
      });

      const nextStudents = sortStudents([
        ...students.filter((student) => student.id !== created.id),
        created,
      ]);

      setStudents(nextStudents);
      setStoredStudents(nextStudents);
      setStudentEmail("");
      setStudentName("");
      setIsModalOpen(false);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const { status } = error.response;

        if (status === 400) {
          setModalError("Não conseguimos validar os dados do aluno. Verifique as informações.");
        } else if (status === 404) {
          setModalError("Aluno não encontrado com as informações fornecidas.");
        } else if (status === 409) {
          setModalError("Este aluno já está associado a você.");
        } else if (status === 401 || status === 403) {
          setModalError("Sessão expirada. Faça login novamente.");
          handleLogout();
          return;
        } else {
          setModalError("Erro ao adicionar aluno. Tente novamente.");
        }
      } else {
        setModalError("Erro ao adicionar aluno. Tente novamente.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const studentButtons = useMemo(() => (
    students.map((student) => (
      <button
        key={student.id}
        type="button"
        className={styles.studentButton}
      >
        {student.fullName}
      </button>
    ))
  ), [students]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <img src={logo} alt="Logo do Central do Alfabeto" className={styles.logo} />
        <button type="button" className={styles.logoutButton} onClick={handleLogout}>
          Sair
        </button>
      </header>

      <div className={styles.layout}>
        <aside className={`${styles.studentsMenu} ${styles.sidebar}`}>
          <div className={styles.sidebarHeader}>
            <h2 className={styles.sidebarTitle}>Alunos</h2>
            <button type="button" className={styles.addStudentButton} onClick={openModal}>
              Adicionar aluno
            </button>
          </div>

          {fetchError && <p className={styles.error}>{fetchError}</p>}

          <div className={styles.studentList}>
            {isLoading ? (
              <p className={styles.feedback}>Carregando alunos...</p>
            ) : students.length === 0 ? (
              <p className={styles.feedback}>Nenhum aluno vinculado ainda.</p>
            ) : (
              studentButtons
            )}
          </div>
        </aside>

        <main className={styles.mainContent}>
          <div className={styles.placeholder}>
            Selecione um aluno para visualizar detalhes.
          </div>
        </main>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>Adicionar aluno</h3>
            <form className={styles.modalForm} onSubmit={handleAddStudent}>
              <label className={styles.modalField}>
                <span>Email</span>
                <input
                  type="email"
                  value={studentEmail}
                  onChange={(event) => setStudentEmail(event.target.value)}
                  required
                />
              </label>

              <label className={styles.modalField}>
                <span>Nome do aluno</span>
                <input
                  type="text"
                  value={studentName}
                  onChange={(event) => setStudentName(event.target.value)}
                  required
                />
              </label>

              {modalError && <p className={styles.modalError}>{modalError}</p>}

              <div className={styles.modalActions}>
                <button type="button" onClick={closeModal} className={styles.modalSecondaryButton}>
                  Fechar
                </button>
                <button type="submit" className={styles.modalPrimaryButton} disabled={isSubmitting}>
                  {isSubmitting ? "Adicionando..." : "Adicionar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
