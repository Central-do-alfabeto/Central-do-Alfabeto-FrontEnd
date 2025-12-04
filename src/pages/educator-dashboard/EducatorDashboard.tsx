import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../../assets/styles/css/educator-dashboard.module.css";
import logo from "../../assets/images/logo-do-site.png";
import { Letters } from "../../store/gameConstants";
import type { TeacherStudentSummary } from "../../services/api/loginAPI";
import {
  addEducatorStudent,
  fetchEducatorStudents,
  fetchStudentProgress,
  type StudentProgress,
} from "../../services/api/educatorStudents";
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
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedStudentProgress, setSelectedStudentProgress] = useState<StudentProgress | null>(null);
  const [isProgressLoading, setIsProgressLoading] = useState(false);
  const [progressError, setProgressError] = useState<string | null>(null);
  const progressRequestIdRef = useRef(0);

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

  useEffect(() => {
    if (selectedStudentId && !students.some((student) => student.id === selectedStudentId)) {
      setSelectedStudentId(null);
      setSelectedStudentProgress(null);
      setProgressError(null);
      setIsProgressLoading(false);
      progressRequestIdRef.current = 0;
    }
  }, [students, selectedStudentId]);

  const resolvePhaseLetter = (phaseIndex: number | null | undefined): string => {
    if (phaseIndex === null || phaseIndex === undefined) {
      return "Nenhuma fase";
    }

    const letter = Letters[phaseIndex]?.letter;
    return letter ?? `Fase ${phaseIndex}`;
  };

  const handleSelectStudent = useCallback((student: TeacherStudentSummary) => {
    setSelectedStudentId(student.id);
    setProgressError(null);
    setIsProgressLoading(true);
    setSelectedStudentProgress(null);

    const requestId = progressRequestIdRef.current + 1;
    progressRequestIdRef.current = requestId;

    fetchStudentProgress(student.id)
      .then((progress) => {
        if (progressRequestIdRef.current !== requestId) {
          return;
        }

        setSelectedStudentProgress(progress);
      })
      .catch((error) => {
        if (progressRequestIdRef.current !== requestId) {
          return;
        }

        if (axios.isAxiosError(error) && error.response && [401, 403].includes(error.response.status)) {
          handleLogout();
          return;
        }

        setProgressError("Não foi possível carregar o progresso do aluno.");
        console.error("Falha ao carregar progresso do aluno:", error);
      })
      .finally(() => {
        if (progressRequestIdRef.current === requestId) {
          setIsProgressLoading(false);
        }
      });
  }, [handleLogout]);

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
    students.map((student) => {
      const isActive = student.id === selectedStudentId;
      const className = isActive
        ? `${styles.studentButton} ${styles.studentButtonActive}`
        : styles.studentButton;

      return (
        <button
          key={student.id}
          type="button"
          className={className}
          onClick={() => handleSelectStudent(student)}
          disabled={isProgressLoading && student.id === selectedStudentId}
        >
          {student.fullName}
        </button>
      );
    })
  ), [handleSelectStudent, isProgressLoading, selectedStudentId, students]);

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
          {progressError ? (
            <div className={styles.errorPanel}>{progressError}</div>
          ) : isProgressLoading && !selectedStudentProgress ? (
            <p className={styles.feedback}>Carregando progresso do aluno...</p>
          ) : selectedStudentProgress ? (
            <div className={styles.detailsContainer}>
              <section className={styles.studentHeader}>
                <div>
                  <h2 className={styles.studentName}>{selectedStudentProgress.studentName ?? "Aluno"}</h2>
                  <p className={styles.studentMeta}><span>Email:</span> {selectedStudentProgress.studentEmail ?? "Não informado"}</p>
                  <p className={styles.studentMeta}>
                    <span>Última fase concluída:</span> {resolvePhaseLetter(selectedStudentProgress.lastCompletedPhaseIndex)}
                  </p>
                </div>
                {isProgressLoading && (
                  <span className={styles.loadingNotice}>Atualizando dados...</span>
                )}
              </section>

              <section className={styles.snapshotsSection}>
                {selectedStudentProgress.snapshots.length === 0 ? (
                  <p className={styles.feedback}>Nenhum progresso registrado até o momento.</p>
                ) : (
                  <table className={styles.snapshotsTable}>
                    <thead>
                      <tr>
                        <th>Fase</th>
                        <th>Erros na fase</th>
                        <th>Reproduções de áudio na fase</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedStudentProgress.snapshots.map((snapshot) => (
                        <tr key={snapshot.phaseIndex}>
                          <td>{resolvePhaseLetter(snapshot.phaseIndex)}</td>
                          <td>{snapshot.totalErrors}</td>
                          <td>{snapshot.totalAudioReproductions}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </section>
            </div>
          ) : (
            <div className={styles.placeholder}>
              Selecione um aluno para visualizar detalhes.
            </div>
          )}
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
