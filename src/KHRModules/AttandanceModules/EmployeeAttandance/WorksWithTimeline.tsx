interface WorkStat {
  label: string;
  value: string;
  color: string;
}

interface Props {
  stats: WorkStat[];
}

const WorkStatsWithTimeline = ({ stats }: Props) => {
  return (
    <div className="col-md-12">
      <div className="card">
        <div className="card-body">
          {/* Stats */}
          <div className="row">
            {stats.map((item, index) => (
              <div className="col-xl-3" key={index}>
                <div className="mb-3">
                  <p className="d-flex align-items-center mb-1">
                    <i
                      className={`ti ti-point-filled text-${item.color} me-1`}
                    />
                    {item.label}
                  </p>
                  <h3>{item.value}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div className="row">
            <div className="col-md-12">
              <div
                className="progress bg-transparent-dark mb-3"
                style={{ height: 24 }}
              >
                <div
                  className="progress-bar bg-white rounded"
                  style={{ width: "18%" }}
                />
                <div
                  className="progress-bar bg-success rounded me-2"
                  style={{ width: "18%" }}
                />
                <div
                  className="progress-bar bg-warning rounded me-2"
                  style={{ width: "5%" }}
                />
                <div
                  className="progress-bar bg-success rounded me-2"
                  style={{ width: "28%" }}
                />
                <div
                  className="progress-bar bg-warning rounded me-2"
                  style={{ width: "17%" }}
                />
                <div
                  className="progress-bar bg-success rounded me-2"
                  style={{ width: "22%" }}
                />
                <div
                  className="progress-bar bg-warning rounded me-2"
                  style={{ width: "5%" }}
                />
                <div
                  className="progress-bar bg-info rounded me-2"
                  style={{ width: "3%" }}
                />
                <div
                  className="progress-bar bg-info rounded"
                  style={{ width: "2%" }}
                />
                <div
                  className="progress-bar bg-white rounded"
                  style={{ width: "18%" }}
                />
              </div>
            </div>

            <div className="col-md-12">
              <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-2">
                {[
                  "06:00",
                  "07:00",
                  "08:00",
                  "09:00",
                  "10:00",
                  "11:00",
                  "12:00",
                  "01:00",
                  "02:00",
                  "03:00",
                  "04:00",
                  "05:00",
                  "06:00",
                  "07:00",
                  "08:00",
                  "09:00",
                  "10:00",
                  "11:00",
                ].map((time, i) => (
                  <span className="fs-10" key={i}>
                    {time}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkStatsWithTimeline;
