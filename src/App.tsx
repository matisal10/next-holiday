import { useEffect, useState } from 'react'
import { Holiday } from './holiday';

function App() {
  const [count, setCount] = useState(0)
  const [holidays, setHolidays] = useState<Holiday[]>([])
  const [nextHoliday, setNextHoliday] = useState<Holiday>()
  const [prevHoliday, setPrevHoliday] = useState<Holiday>()

  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  const days = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado']
  const dayOfWeek = (day: number, month: number, year: number) => days[new Date(year, month, day).getDay()]


  const getData = async () => {
    const data = await fetch('http://nolaborables.com.ar/api/v2/feriados/2023')
    const res = await data.json()
    await setHolidays(res)
  }

  const findHoliday = () => {
    const now = new Date()
    const today = {
      day: now.getDate(),
      month: now.getMonth() + 1
    };

    const holiday = holidays.find((h) =>
      h.mes === today.month && h.dia > today.day || h.mes > today.month
    );
    if (holiday) {
      const holidayDate = new Date(now.getFullYear(), holiday.mes - 1, holiday.dia);
      const timeDiff = holidayDate.getTime() - now.getTime();
      const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
      previusHoliday(holiday);
      setCount(daysRemaining)
      setNextHoliday(holiday);
      return daysRemaining;
    }



    function previusHoliday(holiday: Holiday) {
      const index = holidays.findIndex((item) => holiday.id === item.id);
      if (index >= 0) {
        setPrevHoliday(holidays[index - 1]);
      }
    }
  }

  useEffect(() => {
    getData()
    findHoliday()
  }, [])


  return (
    <main>
      <section>
        <h2>Anterior Feriado</h2>
        {
          prevHoliday ?
            <div>
              <span>{dayOfWeek(prevHoliday.dia, prevHoliday.mes - 1, 2023)} </span>
              <span>{prevHoliday.dia}/{prevHoliday.mes}</span>
            </div>
            : 
            <></>
        }
        <h3>Motivo: {prevHoliday?.motivo}</h3>
      </section>

      <section>
        <h1>Faltan {count} días para el próximo feriado</h1>
      </section>

      <section>
        {
          nextHoliday ?
            <div>
              <h3>{dayOfWeek(nextHoliday?.dia, nextHoliday?.mes - 1, 2023)} {nextHoliday?.dia}/{nextHoliday?.mes}</h3>
            </div>
            :
            <></>
        }

        <h3>Motivo: {nextHoliday?.motivo}</h3>
      </section>
    </main>
  )
}

export default App
