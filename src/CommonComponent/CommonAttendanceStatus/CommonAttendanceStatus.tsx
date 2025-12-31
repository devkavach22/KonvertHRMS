type AttendanceCard = {
  id: string | number;
  title: string;
  count: number;
  badgeType: string;
  icon: string;
  percentage: string | number;
};

interface CommonAttendanceStatusProps {
  cards: AttendanceCard[];
}

const CommonAttendanceStatus: React.FC<CommonAttendanceStatusProps> = ({
  cards,
}) => {
  return (
    <div className="row gx-0">
      {cards.map((item, index) => (
        <div
          key={item.id}
          className={`col-md col-sm-4 ${
            index !== cards.length - 1 ? "border-end" : ""
          }`}
        >
          <div className="p-3">
            <span className="fw-medium mb-1 d-block">{item.title}</span>

            <div className="d-flex align-items-center justify-content-between">
              <h5>{item.count}</h5>

              <span
                className={`badge badge-${item.badgeType} d-inline-flex align-items-center`}
              >
                <i className={`ti ${item.icon} me-1`} />
                {item.percentage}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommonAttendanceStatus;
