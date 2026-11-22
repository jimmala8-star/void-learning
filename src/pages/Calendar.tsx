import { useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Clock,
  BookOpen,
} from "lucide-react";
import { usePageAnimation } from "../hooks/usePageAnimation";

type EventType = "Aula" | "Prova";

type AcademicEvent = {
  date: string;
  title: string;
  short: string;
  detail: string;
  type: EventType;
  time: string;
};

const monthNames = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const weekdayLabels = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

const shortNames: Record<string, string> = {
  "Programação FrontEnd": "Front",
  "Banco de Dados": "BD",
  "UX/UI Design": "UX/UI",
};

const classSchedule = [
  { weekday: 1, subject: "Programação FrontEnd", time: "19:00 – 20:40", topic: "Componentes, HTML, CSS e interfaces" },
  { weekday: 2, subject: "Banco de Dados", time: "19:00 – 20:40", topic: "Modelagem relacional e consultas SQL" },
  { weekday: 3, subject: "UX/UI Design", time: "20:50 – 22:30", topic: "Experiência do usuário e prototipagem" },
  { weekday: 4, subject: "Programação FrontEnd", time: "19:00 – 20:40", topic: "JavaScript, React e projeto de interface" },
  { weekday: 5, subject: "Banco de Dados", time: "19:00 – 20:40", topic: "Relacionamentos, normalização e SQL" },
];

function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function parseKey(key: string) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function buildAcademicEvents(): AcademicEvent[] {
  const events: AcademicEvent[] = [];
  const start = new Date(2026, 7, 3); // 03/08/2026
  const lastClass = new Date(2026, 10, 20); // 20/11/2026

  for (const date = new Date(start); date <= lastClass; date.setDate(date.getDate() + 1)) {
    const classInfo = classSchedule.find((item) => item.weekday === date.getDay());
    if (!classInfo) continue;
    events.push({
      date: dateKey(date),
      title: classInfo.subject,
      short: shortNames[classInfo.subject] ?? classInfo.subject,
      detail: classInfo.topic,
      type: "Aula",
      time: classInfo.time,
    });
  }

  // Semana de avaliações: última semana letiva de novembro (23 a 27/11/2026).
  const exams = [
    { day: 23, subject: "Programação FrontEnd" },
    { day: 24, subject: "Banco de Dados" },
    { day: 25, subject: "UX/UI Design" },
    { day: 26, subject: "Programação FrontEnd" },
    { day: 27, subject: "Banco de Dados" },
  ];
  exams.forEach((exam) =>
    events.push({
      date: dateKey(new Date(2026, 10, exam.day)),
      title: `Prova • ${exam.subject}`,
      short: "Prova",
      detail: "Semana de avaliações do semestre",
      type: "Prova",
      time: "19:00",
    })
  );

  return events;
}

const allEvents = buildAcademicEvents();

const eventsByDate = allEvents.reduce((map, event) => {
  const list = map.get(event.date) ?? [];
  list.push(event);
  map.set(event.date, list);
  return map;
}, new Map<string, AcademicEvent[]>());

function Calendar() {
  const today = useMemo(() => new Date(), []);
  const todayKey = dateKey(today);

  const [view, setView] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState(todayKey);
  const [show, setShow] = useState<Record<EventType, boolean>>({ Aula: true, Prova: true });

  const pageRef = useRef<HTMLElement>(null);
  usePageAnimation(pageRef);

  const year = view.getFullYear();
  const month = view.getMonth();

  const cells = useMemo(() => {
    const offset = (new Date(year, month, 1).getDay() + 6) % 7; // semana começa na segunda
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const total = Math.ceil((offset + daysInMonth) / 7) * 7;
    return Array.from({ length: total }, (_, i) => new Date(year, month, 1 - offset + i));
  }, [year, month]);

  const monthStats = useMemo(() => {
    let classes = 0;
    let exams = 0;
    allEvents.forEach((event) => {
      const d = parseKey(event.date);
      if (d.getFullYear() !== year || d.getMonth() !== month) return;
      if (event.type === "Prova") exams += 1;
      else classes += 1;
    });
    return { classes, exams };
  }, [year, month]);

  const upcomingExams = useMemo(
    () =>
      allEvents
        .filter((event) => event.type === "Prova" && event.date >= todayKey)
        .sort((a, b) => a.date.localeCompare(b.date)),
    [todayKey]
  );

  const eventsOf = (key: string) => (eventsByDate.get(key) ?? []).filter((event) => show[event.type]);

  const selectedDate = parseKey(selected);
  const selectedEvents = eventsOf(selected);

  function changeMonth(delta: number) {
    const next = new Date(year, month + delta, 1);
    setView(next);
    const isTodayMonth = next.getFullYear() === today.getFullYear() && next.getMonth() === today.getMonth();
    setSelected(isTodayMonth ? todayKey : dateKey(next));
  }

  function goToday() {
    setView(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelected(todayKey);
  }

  function selectDate(date: Date) {
    setSelected(dateKey(date));
    if (date.getMonth() !== month || date.getFullYear() !== year) {
      setView(new Date(date.getFullYear(), date.getMonth(), 1));
    }
  }

  function toggle(type: EventType) {
    setShow((current) => ({ ...current, [type]: !current[type] }));
  }

  return (
    <section className="page-section vcal" ref={pageRef}>
      <div className="vcal-heading" data-animate>
        <div>
          <h1>Calendário acadêmico</h1>
          <p>Aulas de agosto a novembro de 2026 e avaliações na última semana de novembro.</p>
        </div>
        <div className="vcal-stats">
          <div className="vcal-stat">
            <strong>{monthStats.classes}</strong>
            <span>aulas em {monthNames[month].toLowerCase()}</span>
          </div>
          <div className="vcal-stat">
            <strong>{monthStats.exams}</strong>
            <span>avaliações no mês</span>
          </div>
        </div>
      </div>

      <div className="vcal-layout">
        <section className="vcal-card vcal-main" data-animate aria-label="Calendário do mês">
          <div className="vcal-top">
            <div className="vcal-title">
              <h2>
                {monthNames[month]} <span>{year}</span>
              </h2>
            </div>

            <div className="vcal-controls">
              <button type="button" className="vcal-today" onClick={goToday}>
                Hoje
              </button>
              <div className="vcal-nav">
                <button type="button" onClick={() => changeMonth(-1)} aria-label="Mês anterior" >
                  <ChevronLeft size={20} />
                </button>
                <button type="button" onClick={() => changeMonth(1)} aria-label="Próximo mês" >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>

          <div className="vcal-filters" role="group" aria-label="Filtrar eventos">
            <button
              type="button"
              className={`vcal-filter vcal-filter--class ${show.Aula ? "is-on" : ""}`}
              aria-pressed={show.Aula}
              onClick={() => toggle("Aula")}
            >
              <i /> Aulas
            </button>
            <button
              type="button"
              className={`vcal-filter vcal-filter--exam ${show.Prova ? "is-on" : ""}`}
              aria-pressed={show.Prova}
              onClick={() => toggle("Prova")}
            >
              <i /> Provas
            </button>
          </div>

          <div className="vcal-weekdays" aria-hidden="true">
            {weekdayLabels.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>

          <div className="vcal-grid">
            {cells.map((date) => {
              const key = dateKey(date);
              const inMonth = date.getMonth() === month;
              const dayEvents = eventsOf(key);
              const isToday = key === todayKey;
              const isSelected = key === selected;
              const label = `${date.getDate()} de ${monthNames[date.getMonth()]}${
                dayEvents.length ? `, ${dayEvents.length} compromisso(s)` : ""
              }`;

              return (
                <button
                  type="button"
                  key={key}
                  className={[
                    "vcal-day",
                    inMonth ? "" : "is-outside",
                    isToday ? "is-today" : "",
                    isSelected ? "is-selected" : "",
                  ].join(" ")}
                  onClick={() => selectDate(date)}
                  aria-label={label}
                  aria-pressed={isSelected}
                >
                  <span className="vcal-day__number">{date.getDate()}</span>
                  <span className="vcal-day__events">
                    {dayEvents.slice(0, 2).map((event) => (
                      <span
                        key={`${event.date}-${event.title}`}
                        className={`vcal-chip ${event.type === "Prova" ? "vcal-chip--exam" : "vcal-chip--class"}`}
                        title={event.title}
                      >
                        <i />
                        <em>{event.short}</em>
                      </span>
                    ))}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <aside className="vcal-side">
          <section className="vcal-card vcal-panel" data-animate aria-live="polite">
            <span className="vcal-eyebrow">
              {selected === todayKey ? "Hoje" : "Dia selecionado"}
            </span>
            <h2 className="vcal-panel__date">
              {selectedDate.toLocaleDateString("pt-BR", { weekday: "long" })}
              <span>
                {selectedDate.getDate()} de {monthNames[selectedDate.getMonth()].toLowerCase()}
              </span>
            </h2>

            <div className="vcal-panel__list" key={selected}>
              {selectedEvents.length > 0 ? (
                selectedEvents.map((event) => (
                  <article
                    key={`${event.date}-${event.title}`}
                    className={`vcal-agenda ${event.type === "Prova" ? "vcal-agenda--exam" : "vcal-agenda--class"}`}
                  >
                    <span className="vcal-agenda__icon">
                      {event.type === "Prova" ? <ClipboardCheck size={18} /> : <BookOpen size={18} />}
                    </span>
                    <div>
                      <strong>{event.title}</strong>
                      <span>{event.detail}</span>
                      <small>
                        <Clock size={13} /> {event.time}
                      </small>
                    </div>
                  </article>
                ))
              ) : (
                <p className="vcal-empty">
                  <CalendarDays size={20} />
                  Nada marcado para este dia.
                </p>
              )}
            </div>
          </section>

          <section className="vcal-card" data-animate>
            <span className="vcal-eyebrow">Próximas avaliações</span>
            {upcomingExams.length > 0 ? (
              <ul className="vcal-exams">
                {upcomingExams.map((exam) => {
                  const d = parseKey(exam.date);
                  return (
                    <li key={`${exam.date}-${exam.title}`}>
                      <button type="button" className="vcal-exams__item" onClick={() => selectDate(d)}>
                        <span className="vcal-exams__date">
                          <strong>{d.getDate()}</strong>
                          <small>{monthNames[d.getMonth()].slice(0, 3)}</small>
                        </span>
                        <span className="vcal-exams__text">
                          <strong>{exam.title.replace("Prova • ", "")}</strong>
                          <small>{exam.time}</small>
                        </span>
                        <ChevronRight size={16} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="vcal-empty">Nenhuma avaliação futura cadastrada.</p>
            )}
          </section>
        </aside>
      </div>
    </section>
  );
}

export default Calendar;
