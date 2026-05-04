import dayjs from 'dayjs';
import UTC from 'dayjs/plugin/utc';

dayjs.extend(UTC);

const DateCell = ({ time }: { time: string }) => {
  return (
    <div>
      <p>{time ? dayjs(time).format('hh:mm A, DD/MM/YYYY') : '-'}</p>
    </div>
  );
};

export default DateCell;


